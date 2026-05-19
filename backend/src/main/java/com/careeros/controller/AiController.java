package com.careeros.controller;

import com.careeros.service.AiService;
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

    @PostMapping("/chat-resume")
    public ResponseEntity<Map<String, Object>> chatResume(
            @RequestParam("question") String question,
            @RequestParam("resumeText") String resumeText) {

        try {
            Map<String, Object> result = aiService.chatResume(resumeText, question);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/interview/generate-questions")
    public ResponseEntity<Object> generateInterviewQuestions(@RequestBody Map<String, Object> request) {
        try {
            return ResponseEntity.ok(aiService.generateInterviewQuestions(request));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/interview/evaluate-answer")
    public ResponseEntity<Object> evaluateInterviewAnswer(@RequestBody Map<String, Object> submission) {
        try {
            return ResponseEntity.ok(aiService.evaluateInterviewAnswer(submission));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/dsa/generate-roadmap")
    public ResponseEntity<Object> generateDsaRoadmap(@RequestBody Map<String, Object> request) {
        try {
            return ResponseEntity.ok(aiService.generateDsaRoadmap(request));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/dsa/recommend-problems")
    public ResponseEntity<Object> recommendDsaProblems(
            @RequestParam("topic") String topic,
            @RequestParam(value = "count", required = false) Integer count,
            @RequestParam(value = "difficulty", required = false) String difficulty) {
        try {
            return ResponseEntity.ok(aiService.recommendDsaProblems(topic, count, difficulty));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}