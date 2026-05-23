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
     * @param keyword     job title / company keyword (null = any)
     * @param location    country / city filter (null = any)
     * @param jobType     e.g. "Full-time", "Remote" (null = any)
     * @param limit       max results per request
     * @return list of uniform job records (never null)
     */
    public List<Map<String, Object>> searchJobs(String keyword, String location,
                                                String jobType, int limit) {
        try {
            long now = System.currentTimeMillis();
            if (now - lastFetchTime > cacheExpiryMs) {
                cache.clear();
                lastFetchTime = now;
            }

            String cacheKey = (keyword + "|" + location + "|" + jobType + "|" + limit).toLowerCase();
            if (cache.containsKey(cacheKey)) {
                return cache.get(cacheKey);
            }

            StringBuilder url = new StringBuilder(BASE_URL);
            url.append("?limit=").append(Math.min(limit, 200));

            if (keyword != null && !keyword.isBlank())
                url.append("&keyword=").append(java.net.URLEncoder.encode(keyword, "UTF-8"));
            if (location != null && !location.isBlank())
                url.append("&location=").append(java.net.URLEncoder.encode(location, "UTF-8"));
            if (jobType != null && !jobType.isBlank())
                url.append("&type=").append(java.net.URLEncoder.encode(jobType, "UTF-8"));

            String response = restTemplate.getForObject(url.toString(), String.class);
            return parseAndFilter(response, keyword, location, jobType, limit, cacheKey);

        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /**
     * Convenience overload – no filters.
     */
    public List<Map<String, Object>> getFreshJobs(int limit) {
        return searchJobs(null, null, null, limit);
    }

    // ─── internals ───────────────────────────────────────────────────

    private List<Map<String, Object>> parseAndFilter(String response,
                                                     String keyword, String location,
                                                     String jobType, int limit, String cacheKey)
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
                .filter(job -> matchesFilters(job, keyword, location, jobType))
                .limit(limit)
                .collect(Collectors.toList());

        cache.put(cacheKey, result);
        return result;
    }

    private boolean matchesFilters(Map<String, Object> job, String keyword,
                                   String location, String jobType) {
        if (keyword != null && !keyword.isBlank()) {
            String kw = keyword.toLowerCase();
            String title = str(job, "title").toLowerCase();
            String company = str(job, "company").toLowerCase();
            if (!title.contains(kw) && !company.contains(kw)) return false;
        }
        if (location != null && !location.isBlank()) {
            String loc = location.toLowerCase();
            if (!str(job, "location").toLowerCase().contains(loc)) return false;
        }
        if (jobType != null && !jobType.isBlank()) {
            String jt = jobType.toLowerCase();
            if (!str(job, "job_type").toLowerCase().contains(jt)) return false;
        }
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
