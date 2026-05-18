package com.placement.controller;

import com.placement.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/analyze-resume")
    public ResponseEntity<Map<String, Object>> analyzeResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "role", required = false) String targetRole) {

        try {
            Map<String, Object> result = aiService.analyzeResume(file, targetRole);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/analyze-ats")
    public ResponseEntity<Map<String, Object>> analyzeATS(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription) {

        try {
            Map<String, Object> result = aiService.analyzeATS(file, jobDescription);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/rewrite-resume")
    public ResponseEntity<Map<String, Object>> rewriteResume(
            @RequestParam("resumeText") String resumeText,
            @RequestParam("section") String section,
            @RequestParam(value = "suggestions", required = false) String suggestions) {

        try {
            Map<String, Object> result = aiService.rewriteResumeSection(resumeText, section, suggestions);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}