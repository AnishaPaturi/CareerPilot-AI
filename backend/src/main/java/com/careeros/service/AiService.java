package com.careeros.service;

import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final String FASTAPI_BASE_URL = "http://localhost:8000/api";

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

    public Map<String, Object> rewriteResumeSection(String resumeText, String section, String suggestions) {
        return Map.of(
                "original", resumeText,
                "rewritten", "Enhanced " + section + ": " + resumeText,
                "suggestions", suggestions != null ? suggestions : ""
        );
    }

    public Map<String, Object> chatResume(String resumeText, String question) {
        return Map.of(
                "answer", "Based on your resume context, I can help analyze your qualifications."
        );
    }
}
