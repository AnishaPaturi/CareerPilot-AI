package com.careeros.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> parseResumeForProfile(MultipartFile file) {
        try {
            String text = new String(file.getBytes());
            return Map.of(
                    "skills", "Java, Spring Boot, SQL",
                    "certifications", "None",
                    "cgpa", 8.5,
                    "education", "B.Tech Computer Science",
                    "experience", "Fresher",
                    "projects", "AI Career Platform",
                    "summary", "Resume parsed successfully."
            );
        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }

    public Map<String, Object> analyzeResume(MultipartFile file, String targetRole) {
        try {
            return Map.of(
                    "score", 85,
                    "verdict", "Good Fit",
                    "suggestions", List.of("Add more project details", "Highlight certifications"),
                    "missingSkills", List.of("Docker", "Kubernetes")
            );
        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }

    public Map<String, Object> analyzeATS(MultipartFile file, String jobDescription) {
        try {
            return Map.of(
                    "atsScore", 78,
                    "keywordMatch", List.of("Java", "Spring Boot"),
                    "missingKeywords", List.of("Microservices", "AWS"),
                    "suggestions", List.of("Add Microservices experience")
            );
        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
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
                "answer", "Based on your resume context, I can help analyze your qualifications. " +
                        "In production this would be powered by an LLM with your full resume text."
        );
    }
}
