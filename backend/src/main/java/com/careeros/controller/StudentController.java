package com.placement.controller;

import com.placement.model.ResumeAnalysis;
import com.placement.model.Student;
import com.placement.repository.ResumeAnalysisRepository;
import com.placement.repository.StudentRepository;
import com.placement.service.AiService;
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
            Map<String, Object> aiResult = aiService.parseResumeForProfile(file);

            Student student = studentRepository.findById(id);
            if (student == null) {
                return ResponseEntity.status(404).body(Map.of("success", false, "message", "Student not found"));
            }

            String skills = (String) aiResult.getOrDefault("skills", "");
            String certifications = (String) aiResult.getOrDefault("certifications", "");
            Object cgpaObj = aiResult.get("cgpa");
            Double cgpa = cgpaObj instanceof Number ? ((Number) cgpaObj).doubleValue() : null;
            String education = (String) aiResult.getOrDefault("education", "");
            String experience = (String) aiResult.getOrDefault("experience", "");
            String projects = (String) aiResult.getOrDefault("projects", "");
            String summary = (String) aiResult.getOrDefault("summary", "");

            student.setSkills(skills);
            student.setCertifications(certifications);
            if (cgpa != null) student.setCgpa(cgpa);
            student.setResumeUrl(file.getOriginalFilename());
            student.setEducation(education);
            student.setExperience(experience);
            student.setProjects(projects);
            student.setSummary(summary);
            studentRepository.update(student);

            ResumeAnalysis analysis = new ResumeAnalysis();
            analysis.setStudentId(id);
            analysis.setSkills(skills);
            analysis.setCertifications(certifications);
            analysis.setCgpa(cgpa);
            analysis.setEducation(education);
            analysis.setExperience(experience);
            analysis.setProjects(projects);
            analysis.setSummary(summary);
            analysis.setRawAnalysis(aiResult.toString());
            resumeAnalysisRepository.save(analysis);

            Map<String, Object> parsedData = new HashMap<>();
            parsedData.put("skills", skills);
            parsedData.put("certifications", certifications);
            parsedData.put("cgpa", cgpa);
            parsedData.put("education", education);
            parsedData.put("experience", experience);
            parsedData.put("projects", projects);
            parsedData.put("summary", summary);
            parsedData.put("resumeUrl", file.getOriginalFilename());
            parsedData.put("success", true);
            parsedData.put("message", "Resume parsed successfully by AI Engine.");

            return ResponseEntity.ok(parsedData);

        } catch (Exception e) {
            System.err.println("Error parsing resume: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Failed to parse resume: " + e.getMessage()
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
        studentRepository.update(student);
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

