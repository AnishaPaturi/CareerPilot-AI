package com.careeros.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class AiService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();
    private final String FASTAPI_BASE_URL = "http://localhost:8000/api/ai";

    public Map<String, Object> parseResumeForProfile(MultipartFile file) {
        try {
            Map<String, Object> analysis = analyzeATS(file, null);
            
            Object skillsMatch = analysis.get("skills_match");
            String skillsStr = "";
            if (skillsMatch instanceof Map) {
                skillsStr = String.join(", ", ((Map<String, Boolean>) skillsMatch).keySet());
            }
            String summary = (String) analysis.getOrDefault("summary", "Resume parsed successfully.");

            return Map.of(
                    "skills", skillsStr.isEmpty() ? "Parsed from AI" : skillsStr,
                    "certifications", "None",
                    "cgpa", 0.0,
                    "education", "Parsed from Resume",
                    "experience", "Parsed from Resume",
                    "projects", "Parsed from Resume",
                    "summary", summary
            );
        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }

    public Map<String, Object> analyzeATS(MultipartFile file, String jobDescription) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String url = FASTAPI_BASE_URL + "/ats/analyze";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new RuntimeException("FastAPI returned status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }

    public Map<String, Object> analyzeResume(MultipartFile file, String targetRole) {
        return analyzeATS(file, targetRole);
    }

    public Map<String, Object> rewriteResumeSection(Map<String, Object> payload) {
        String url = FASTAPI_BASE_URL + "/ats/rewrite";
        return restTemplate.postForObject(url, payload, Map.class);
    }

    public Map<String, Object> chatResume(String resumeText, String question) {
        String url = FASTAPI_BASE_URL + "/ats/chat";
        Map<String, String> request = Map.of("resume_text", resumeText, "question", question);
        return restTemplate.postForObject(url, request, Map.class);
    }

    public Object generateInterviewQuestions(Map<String, Object> request) {
        String url = FASTAPI_BASE_URL + "/interview/generate-questions";
        return restTemplate.postForObject(url, request, Object.class);
    }

    public Object evaluateInterviewAnswer(Map<String, Object> submission) {
        String url = FASTAPI_BASE_URL + "/interview/evaluate-answer";
        return restTemplate.postForObject(url, submission, Object.class);
    }

    @Cacheable(value = "dsaRoadmaps", key = "#request.toString()", unless = "#result == null")
    public Object generateDsaRoadmap(Map<String, Object> request) {
        String url = FASTAPI_BASE_URL + "/dsa/generate-roadmap";
        return restTemplate.postForObject(url, request, Object.class);
    }

    @Cacheable(value = "dsaProblems", key = "{#topic, #count, #difficulty}", unless = "#result == null")
    public Object recommendDsaProblems(String topic, Integer count, String difficulty) {
        StringBuilder url = new StringBuilder(FASTAPI_BASE_URL + "/dsa/recommend-problems?topic=" + topic);
        if (count != null) {
            url.append("&count=").append(count);
        }
        if (difficulty != null) {
            url.append("&difficulty=").append(difficulty);
        }
        return restTemplate.postForObject(url.toString(), null, Object.class);
    }

    public Object uploadKnowledgeDocument(MultipartFile file, Integer userId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf";
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            String url = FASTAPI_BASE_URL + "/knowledge/upload?user_id=" + (userId != null ? userId : 1);
            return restTemplate.postForObject(url, requestEntity, Object.class);
        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }

    public Object chatKnowledge(Map<String, Object> request, Integer userId) {
        String url = FASTAPI_BASE_URL + "/knowledge/chat?user_id=" + (userId != null ? userId : 1);
        return restTemplate.postForObject(url, request, Object.class);
    }

    public Object summarizeKnowledge(Integer userId) {
        String url = FASTAPI_BASE_URL + "/knowledge/summarize?user_id=" + (userId != null ? userId : 1);
        return restTemplate.postForObject(url, null, Object.class);
    }

    @Cacheable(value = "knowledgeQuizzes", key = "{#topic, #userId, #numQuestions}", unless = "#result == null")
    public Object generateKnowledgeQuiz(String topic, Integer userId, Integer numQuestions) {
        StringBuilder url = new StringBuilder(FASTAPI_BASE_URL + "/knowledge/quiz?topic=" + topic + "&user_id=" + (userId != null ? userId : 1));
        if (numQuestions != null) {
            url.append("&num_questions=").append(numQuestions);
        }
        return restTemplate.postForObject(url.toString(), null, Object.class);
    }

    public Map<String, Object> convertResumeToDocx(Map<String, Object> payload) {
        String url = FASTAPI_BASE_URL + "/ats/convert-docx";
        return restTemplate.postForObject(url, payload, Map.class);
    }
}
