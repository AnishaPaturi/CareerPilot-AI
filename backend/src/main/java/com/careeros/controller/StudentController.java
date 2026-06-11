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
import com.careeros.model.Drive;
import com.careeros.model.Application;
import com.careeros.model.ApplicationStatus;
import com.careeros.repository.DriveRepository;
import com.careeros.repository.ApplicationRepository;

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

    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

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

    @PostMapping("/{id}/auto-apply")
    public ResponseEntity<?> autoApply(@PathVariable int id) {
        Student student = studentRepository.findById(id);
        if (student == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Student not found"));
        }

        List<Drive> drives = driveRepository.findAll();
        List<Application> existing = applicationRepository.findByStudentId(id);
        
        List<Map<String, Object>> appliedDrives = new java.util.ArrayList<>();

        for (Drive drive : drives) {
            // Check if already applied
            boolean alreadyApplied = existing.stream().anyMatch(a -> a.getDriveId().equals(drive.getId()));
            if (alreadyApplied) {
                continue;
            }

            // Check CGPA
            if (drive.getMinCgpa() != null && student.getCgpa() != null) {
                if (student.getCgpa() < drive.getMinCgpa()) {
                    continue;
                }
            }

            // Check Backlogs (must be 0)
            if (student.getActiveBacklogs() != null && student.getActiveBacklogs() > 0) {
                continue;
            }

            // Check Branch
            String allowedStr = drive.getAllowedBranches();
            if (allowedStr != null && !allowedStr.isEmpty() && student.getBranch() != null) {
                String studentBranchUpper = student.getBranch().toUpperCase().trim();
                boolean branchMatch = allowedStr.toUpperCase().contains("\"" + studentBranchUpper + "\"")
                                   || allowedStr.toUpperCase().contains("'" + studentBranchUpper + "'")
                                   || allowedStr.toUpperCase().contains(studentBranchUpper);
                if (!branchMatch) {
                    continue;
                }
            }

            // Check Skills Fit
            if (!isSkillsFit(drive.getRole(), student.getSkills())) {
                continue;
            }

            // Apply
            Application app = new Application();
            app.setDriveId(drive.getId());
            app.setStudentId(id);
            app.setStatus(ApplicationStatus.APPLIED);
            app.setStudentName(student.getName());
            app.setCompanyName(drive.getCompanyName());
            app.setRole(drive.getRole());

            applicationRepository.save(app);
            
            appliedDrives.add(Map.of(
                "driveId", drive.getId(),
                "companyName", drive.getCompanyName(),
                "role", drive.getRole(),
                "packageLpa", drive.getPackageLpa() != null ? drive.getPackageLpa() : "N/A"
            ));
        }

        return ResponseEntity.ok(Map.of(
            "success", true,
            "appliedDrives", appliedDrives,
            "count", appliedDrives.size()
        ));
    }

    private boolean isSkillsFit(String role, String skills) {
        if (role == null || skills == null) return true;
        String r = role.toLowerCase();
        String s = skills.toLowerCase();
        
        if (r.contains("frontend") || r.contains("react") || r.contains("ui") || r.contains("ux")) {
            return s.contains("react") || s.contains("frontend") || s.contains("javascript") 
                || s.contains("html") || s.contains("css") || s.contains("typescript") 
                || s.contains("angular") || s.contains("vue") || s.contains("design");
        }
        if (r.contains("backend") || r.contains("java") || r.contains("spring") || r.contains("node")) {
            return s.contains("java") || s.contains("spring") || s.contains("backend") 
                || s.contains("node") || s.contains("python") || s.contains("sql") 
                || s.contains("c++") || s.contains("database") || s.contains("express");
        }
        if (r.contains("cloud") || r.contains("devops") || r.contains("aws") || r.contains("azure")) {
            return s.contains("aws") || s.contains("docker") || s.contains("kubernetes") 
                || s.contains("devops") || s.contains("cloud") || s.contains("terraform") 
                || s.contains("linux") || s.contains("azure");
        }
        if (r.contains("data") || r.contains("analyst") || r.contains("machine learning") || r.contains("ml") || r.contains("ai")) {
            return s.contains("python") || s.contains("data") || s.contains("analyst") 
                || s.contains("machine learning") || s.contains("ml") || s.contains("sql") 
                || s.contains("pandas") || s.contains("model") || s.contains("ai");
        }
        return true;
    }
}

