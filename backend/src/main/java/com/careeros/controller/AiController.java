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

    @PostMapping("/ats/analyze")
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

    @PostMapping("/ats/rewrite")
    public ResponseEntity<Map<String, Object>> rewriteResume(@RequestBody Map<String, String> payload) {
        try {
            String resumeText = payload.get("resumeText");
            Map<String, Object> result = aiService.rewriteResumeSection(resumeText, null, null);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/ats/chat")
    public ResponseEntity<Map<String, Object>> chatResume(@RequestBody Map<String, String> payload) {
        try {
            String resumeText = payload.get("resumeText");
            String question = payload.get("question");
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

    @PostMapping("/knowledge/upload")
    public ResponseEntity<Object> uploadKnowledgeDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "userId", required = false) Integer userId) {
        try {
            return ResponseEntity.ok(aiService.uploadKnowledgeDocument(file, userId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/knowledge/chat")
    public ResponseEntity<Object> chatKnowledge(
            @RequestBody Map<String, Object> request,
            @RequestParam(value = "userId", required = false) Integer userId) {
        try {
            return ResponseEntity.ok(aiService.chatKnowledge(request, userId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/knowledge/summarize")
    public ResponseEntity<Object> summarizeKnowledge(
            @RequestParam(value = "userId", required = false) Integer userId) {
        try {
            return ResponseEntity.ok(aiService.summarizeKnowledge(userId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/knowledge/quiz")
    public ResponseEntity<Object> generateKnowledgeQuiz(
            @RequestParam("topic") String topic,
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestParam(value = "numQuestions", required = false) Integer numQuestions) {
        try {
            return ResponseEntity.ok(aiService.generateKnowledgeQuiz(topic, userId, numQuestions));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}