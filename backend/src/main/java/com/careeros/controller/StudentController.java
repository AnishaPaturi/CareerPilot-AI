package com.careeros.controller;

import com.careeros.config.RabbitMQConfig;
import com.careeros.dto.ResumeParseTask;
import com.careeros.model.ResumeAnalysis;
import com.careeros.model.Student;
import com.careeros.repository.ResumeAnalysisRepository;
import com.careeros.repository.StudentRepository;
import com.careeros.service.AiService;
import com.careeros.service.FileStorageService;
import com.careeros.service.ResumeProcessingService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    @Autowired
    private AiService aiService;

    @Autowired
    private ResumeProcessingService resumeProcessingService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Student student) {
        studentRepository.save(student);
        return ResponseEntity.ok("Student registered successfully");
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @PostMapping("/{id}/parse-resume")
    public ResponseEntity<Map<String, Object>> parseResume(
            @PathVariable int id,
            @RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> parsedData = resumeProcessingService.processAndSaveResume(id, file);
            return ResponseEntity.ok(parsedData);
        } catch (Exception e) {
            System.err.println("Error parsing resume: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Failed to parse resume: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/{id}/parse-resume-async")
    public ResponseEntity<Map<String, Object>> parseResumeAsync(
            @PathVariable int id,
            @RequestParam("file") MultipartFile file) {
        try {
            Student student = studentRepository.getById(id);
            if (student == null) {
                return ResponseEntity.status(404).body(Map.of("success", false, "message", "Student not found"));
            }

            // 1. Store file locally
            String storedPath = fileStorageService.storeFile(file);

            // 2. Queue the task
            ResumeParseTask task = new ResumeParseTask(id, storedPath, file.getOriginalFilename(), null);
            rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_RESUME_PARSE, task);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Resume parsing job submitted to queue. Results will be saved asynchronously."
            ));
        } catch (Exception e) {
            System.err.println("Error queuing resume: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Failed to queue resume: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateStudent(@PathVariable int id, @RequestBody Student student) {
        Student existing = studentRepository.findById(id);
        if (existing == null) {
            return ResponseEntity.status(404).body("Student not found");
        }
        student.setId(id);
        studentRepository.save(student);
        return ResponseEntity.ok("Student updated successfully");
    }

    @GetMapping("/{id}/resume-history")
    public List<ResumeAnalysis> getResumeHistory(@PathVariable int id) {
        return resumeAnalysisRepository.findByStudentId(id);
    }

    @PostMapping("/bulk-upload")
    public ResponseEntity<?> bulkUpload(@RequestParam("file") MultipartFile file) {
        try {
            java.util.List<Student> students = new java.util.ArrayList<>();
            String content = new String(file.getBytes(), java.nio.charset.StandardCharsets.UTF_8);
            String[] lines = content.split("\n");

            int successCount = 0;
            java.util.List<String> errors = new java.util.ArrayList<>();

            for (int i = 1; i < lines.length; i++) {
                String line = lines[i].trim();
                if (line.isEmpty()) continue;

                String[] parts = line.split(",");
                if (parts.length < 4) {
                    errors.add("Line " + (i + 1) + ": Insufficient data");
                    continue;
                }

                try {
                    Student student = new Student();
                    student.setName(parts[0].trim());
                    student.setEmail(parts[1].trim());
                    student.setPassword(parts[2].trim());
                    student.setBranch(parts[3].trim());

                    if (parts.length > 4 && !parts[4].trim().isEmpty()) {
                        student.setCgpa(Double.parseDouble(parts[4].trim()));
                    }
                    if (parts.length > 5 && !parts[5].trim().isEmpty()) {
                        student.setActiveBacklogs(Integer.parseInt(parts[5].trim()));
                    }

                    studentRepository.save(student);
                    successCount++;
                } catch (Exception e) {
                    errors.add("Line " + (i + 1) + ": " + e.getMessage());
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("successCount", successCount);
            result.put("failureCount", errors.size());
            result.put("errors", errors);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}

