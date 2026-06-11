package com.careeros.service.careernest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Fetches live job listings from the Career Nest open job board API
 * (https://careernest.cloud/api/feed – no key required).
 *
 * Maps each API record to a uniform record used by both the drives context
 * and the Find Jobs frontend panel.
 */
@Service
public class CareerNestClient {

    private static final String BASE_URL = "https://careernest.cloud/api/feed";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // ── 5-minute in-process cache so we don't hammer the upstream API ──
    private Map<String, List<Map<String, Object>>> cache = new HashMap<>();
    private long cacheExpiryMs = 5 * 60 * 1000;
    private long lastFetchTime = 0;

    public CareerNestClient(RestTemplateBuilder builder, ObjectMapper objectMapper) {
        this.restTemplate = builder
                .errorHandler(new SilentErrorHandler())
                .build();
        this.objectMapper = objectMapper;
    }

    // ─── public API ──────────────────────────────────────────────────

    /**
     * Jobs are always sourced from India (hardcoded filter).
     * @param keyword     job title / company keyword (null = any)
     * @param jobType     e.g. "Full-time", "Remote" (null = any)
     * @param limit       max results per request
     * @return list of uniform job records (never null)
     */
    public List<Map<String, Object>> searchJobs(String keyword, String jobType, int limit) {
        System.out.println("[DEBUG] searchJobs entered: keyword=" + keyword + ", jobType=" + jobType + ", limit=" + limit);
        final String LOCATION = "India";
        try {
            long now = System.currentTimeMillis();
            if (now - lastFetchTime > cacheExpiryMs) {
                cache.clear();
                lastFetchTime = now;
            }

            String cacheKey = (keyword + "|" + LOCATION + "|" + jobType + "|" + limit).toLowerCase();
            System.out.println("[DEBUG] cacheKey=" + cacheKey + ", cache contains=" + cache.containsKey(cacheKey));
            if (cache.containsKey(cacheKey)) {
                return cache.get(cacheKey);
            }

            StringBuilder url = new StringBuilder(BASE_URL);
            url.append("?limit=").append(Math.min(limit, 200));

            if (keyword != null && !keyword.isBlank())
                url.append("&keyword=").append(java.net.URLEncoder.encode(keyword, "UTF-8"));
            url.append("&location=").append(java.net.URLEncoder.encode(LOCATION, "UTF-8"));
            if (jobType != null && !jobType.isBlank())
                url.append("&type=").append(java.net.URLEncoder.encode(jobType, "UTF-8"));

            System.out.println("[DEBUG] Requesting URL: " + url.toString());
            String response = restTemplate.getForObject(url.toString(), String.class);
            List<Map<String, Object>> result = parseAndFilter(response, keyword, jobType, limit, cacheKey);
            if (result == null || result.isEmpty()) {
                System.out.println("[DEBUG] result is empty, fetching mock fallback");
                return getMockJobs(keyword, jobType, limit);
            }
            return result;

        } catch (Exception e) {
            System.err.println("[DEBUG] CareerNest external API unavailable, loading mock jobs: " + e.getMessage());
            return getMockJobs(keyword, jobType, limit);
        }
    }

    /**
     * Convenience overload – no filters.
     */
    public List<Map<String, Object>> getFreshJobs(int limit) {
        return searchJobs(null, null, limit);
    }

    // ─── internals ───────────────────────────────────────────────────

    private List<Map<String, Object>> parseAndFilter(String response,
                                                     String keyword, String jobType, int limit, String cacheKey)
            throws Exception {

        JsonNode root = objectMapper.readTree(response);
        JsonNode jobsNode = root.path("jobs");

        if (!jobsNode.isArray() || jobsNode.isEmpty()) {
            cache.put(cacheKey, Collections.emptyList());
            return Collections.emptyList();
        }

        List<Map<String, Object>> result = jobsNode.findParents("title").stream()
                .filter(Objects::nonNull)
                .map(this::mapJobRecord)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(job -> matchesFilters(job, keyword, jobType))
                .limit(limit)
                .collect(Collectors.toList());

        cache.put(cacheKey, result);
        return result;
    }

    private boolean matchesFilters(Map<String, Object> job, String keyword, String jobType) {
        // Always enforce India — word-boundary check so "Indiana" / "Indianapolis" don't match
        Pattern india = Pattern.compile("\\bindia\\b", Pattern.CASE_INSENSITIVE);
        String jobLoc = str(job, "location");
        if (jobLoc == null || !india.matcher(jobLoc).find()) {
            System.out.println("[DEBUG] job Loc fail: " + job.get("title") + ", location=" + jobLoc);
            return false;
        }

        if (keyword != null && !keyword.isBlank() && !keyword.equalsIgnoreCase("null") && !keyword.equalsIgnoreCase("undefined")) {
            String kw = keyword.toLowerCase();
            String title = str(job, "title").toLowerCase();
            String company = str(job, "company").toLowerCase();
            if (!title.contains(kw) && !company.contains(kw)) {
                System.out.println("[DEBUG] job keyword fail: " + title + ", company=" + company + ", kw=" + kw);
                return false;
            }
        }

        if (jobType != null && !jobType.isBlank() && !jobType.equalsIgnoreCase("null") && !jobType.equalsIgnoreCase("undefined")) {
            String jt = jobType.toLowerCase();
            String jtField = str(job, "job_type");
            if (jtField != null && !jtField.toLowerCase().contains(jt)) {
                System.out.println("[DEBUG] job type fail: " + job.get("title") + ", jtField=" + jtField + ", jt=" + jt);
                return false;
            }
        }

        System.out.println("[DEBUG] job matched successfully: " + job.get("title"));
        return true;
    }

    private Optional<Map<String, Object>> mapJobRecord(JsonNode node) {
        try {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("external_id",   asText(node, "id"));
            m.put("title",         asText(node, "title"));
            m.put("company",       asText(node, "company"));
            m.put("company_logo",  asText(node, "company_logo"));
            m.put("location",      asText(node, "location"));
            m.put("job_type",      asText(node, "job_type"));
            m.put("category",      asText(node, "category"));
            m.put("description",   truncate(asText(node, "description"), 500));
            m.put("salary",        asText(node, "salary"));
            m.put("job_url",       asText(node, "job_url"));        // view on Career Nest
            m.put("apply_url",     asText(node, "apply_url"));      // direct apply link
            m.put("posted_at",     asText(node, "posted_at"));
            // Drive-compatible fields used by existing Dashboard card UI
            m.put("companyName",   asText(node, "company"));
            m.put("packageLpa",    asText(node, "salary") != null && !asText(node, "salary").isBlank()
                    ? asText(node, "salary")
                    : "See posting");
            m.put("source",        "Career Nest (Live)");
            return Optional.of(m);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private static String asText(JsonNode node, String field) {
        JsonNode child = node.get(field);
        return child != null && !child.isNull() ? child.asText() : "";
    }

    private static String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : "";
    }

    private static String truncate(String text, int max) {
        if (text == null) return "";
        text = text.replaceAll("<[^>]*>", "").replaceAll("\\s+", " ").trim();
        return text.length() > max ? text.substring(0, max) + "…" : text;
    }

    private List<Map<String, Object>> getMockJobs(String keyword, String jobType, int limit) {
        System.out.println("[DEBUG] getMockJobs entered: keyword=" + keyword + ", jobType=" + jobType);
        List<Map<String, Object>> mockList = new ArrayList<>();
        
        mockList.add(createMockJob("1", "Software Engineer - React/Node", "Google", "https://logo.clearbit.com/google.com", "Bengaluru, India", "Full-time", "Engineering", "Build scalable web applications using React, Node.js, and TypeScript. Collaborate with cross-functional product teams.", "24 LPA", "https://careers.google.com", "https://careers.google.com", "2026-06-10"));
        mockList.add(createMockJob("2", "Frontend Developer", "Microsoft", "https://logo.clearbit.com/microsoft.com", "Hyderabad, India", "Full-time", "Engineering", "Develop user-facing features and modular web UI components using React, Redux, and modern CSS frameworks.", "18 LPA", "https://careers.microsoft.com", "https://careers.microsoft.com", "2026-06-09"));
        mockList.add(createMockJob("3", "Backend Developer (Java/Spring Boot)", "Amazon", "https://logo.clearbit.com/amazon.com", "Bengaluru, India", "Full-time", "Engineering", "Design and maintain high-performance microservices using Spring Boot, MySQL, Redis, and AWS. Optimize API query speeds.", "20 LPA", "https://aws.amazon.com/careers", "https://aws.amazon.com/careers", "2026-06-08"));
        mockList.add(createMockJob("4", "Full Stack Developer", "Walmart", "https://logo.clearbit.com/walmart.com", "Bengaluru, India", "Full-time", "Engineering", "Work on both frontend interfaces (React) and backend services (Java) for the core global e-commerce checkout systems.", "16 LPA", "https://careers.walmart.com", "https://careers.walmart.com", "2026-06-07"));
        mockList.add(createMockJob("5", "Data Scientist", "Infosys", "https://logo.clearbit.com/infosys.com", "Pune, India", "Full-time", "Data", "Build ML models and analytical pipelines to solve business challenges. Experience in Python, SQL, and Pandas.", "12 LPA", "https://www.infosys.com/careers", "https://www.infosys.com/careers", "2026-06-06"));
        mockList.add(createMockJob("6", "Cloud Engineer (AWS)", "Amazon Web Services", "https://logo.clearbit.com/aws.amazon.com", "Hyderabad, India", "Full-time", "Cloud", "Manage cloud infrastructure deployment pipelines, Terraform scripts, and CI/CD workflows on AWS servers.", "22 LPA", "https://aws.amazon.com/careers", "https://aws.amazon.com/careers", "2026-06-05"));
        mockList.add(createMockJob("7", "Machine Learning Engineer", "Google", "https://logo.clearbit.com/google.com", "Bengaluru, India", "Full-time", "AI/ML", "Train, optimize, and deploy LLMs and deep learning models for next-generation AI assistant features.", "35 LPA", "https://careers.google.com", "https://careers.google.com", "2026-06-04"));
        mockList.add(createMockJob("8", "DevOps Specialist", "TCS", "https://logo.clearbit.com/tcs.com", "Mumbai, India", "Full-time", "DevOps", "Maintain build/release pipelines using Docker, Kubernetes, Jenkins, and shell scripts. Improve infrastructure uptime.", "10 LPA", "https://www.tcs.com/careers", "https://www.tcs.com/careers", "2026-06-03"));
        mockList.add(createMockJob("9", "React Native Developer", "TCS", "https://logo.clearbit.com/tcs.com", "Bengaluru, India", "Full-time", "Mobile", "Design and develop high-performance cross-platform Android and iOS apps using React Native.", "9 LPA", "https://www.tcs.com/careers", "https://www.tcs.com/careers", "2026-06-02"));
        mockList.add(createMockJob("10", "UI/UX Designer", "Infosys", "https://logo.clearbit.com/infosys.com", "Bengaluru, India", "Full-time", "Design", "Create interactive prototypes, wireframes, and premium UI designs using Figma and CSS/HTML modules.", "8 LPA", "https://www.infosys.com/careers", "https://www.infosys.com/careers", "2026-06-01"));

        List<Map<String, Object>> filtered = mockList.stream()
                .filter(job -> matchesFilters(job, keyword, jobType))
                .limit(limit)
                .collect(Collectors.toList());
        System.out.println("[DEBUG] getMockJobs returning " + filtered.size() + " items");
        return filtered;
    }

    private Map<String, Object> createMockJob(String id, String title, String company, String logo, String location, String type, String category, String desc, String salary, String url, String applyUrl, String postedAt) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("external_id",   id);
        m.put("title",         title);
        m.put("company",       company);
        m.put("company_logo",  logo);
        m.put("location",      location);
        m.put("job_type",      type);
        m.put("category",      category);
        m.put("description",   desc);
        m.put("salary",        salary);
        m.put("job_url",       url);
        m.put("apply_url",     applyUrl);
        m.put("posted_at",     postedAt);
        m.put("companyName",   company);
        m.put("packageLpa",    salary);
        m.put("source",        "Local Fallback (Active)");
        return m;
    }

    // ─── error handler that silently absorbs non-2xx responses ───────

    private static class SilentErrorHandler implements ResponseErrorHandler {
        @Override public boolean hasError(ClientHttpResponse response) {
            try {
                HttpStatusCode code = response.getStatusCode();
                return !code.is2xxSuccessful();
            } catch (IOException e) { return true; }
        }
        @Override public void handleError(ClientHttpResponse response) {}
    }
}
