package com.careeros.controller;

import com.careeros.model.Application;
import com.careeros.model.Student;
import com.careeros.repository.ApplicationRepository;
import com.careeros.repository.StudentRepository;
import com.careeros.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @GetMapping("/student/{studentId}")
    public List<Application> getStudentApplications(@PathVariable int studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable int id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().body("Status is required");
        }
        int updated = applicationRepository.updateStatus(id, status);
        if (updated > 0) {
            // Fetch application details for email
            Application app = applicationRepository.getById(id);
            if (app != null) {
                Student student = studentRepository.getById(app.getStudentId());
                if (student != null && emailService != null) {
                    try {
                        emailService.sendApplicationStatusUpdate(student.getEmail(), student.getName(), "Company", status);
                    } catch (Exception e) {
                        System.err.println("Failed to send email: " + e.getMessage());
                    }
                }
            }
            return ResponseEntity.ok("Application status updated successfully");
        }
        return ResponseEntity.status(404).body("Application not found");
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody Application application) {
        try {
            if (application.getAppliedOn() == null) {
                application.setAppliedOn(new java.sql.Timestamp(System.currentTimeMillis()));
            }
            Application saved = applicationRepository.save(application);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(@PathVariable int id, @RequestBody Application updateData) {
        try {
            Application existing = applicationRepository.getById(id);
            if (existing == null) {
                return ResponseEntity.status(404).body("Application not found");
            }
            
            if (updateData.getStatus() != null) existing.setStatus(updateData.getStatus());
            if (updateData.getCompanyName() != null) existing.setCompanyName(updateData.getCompanyName());
            if (updateData.getRole() != null) existing.setRole(updateData.getRole());
            if (updateData.getMatchScore() != null) existing.setMatchScore(updateData.getMatchScore());
            if (updateData.getFollowUpDate() != null) existing.setFollowUpDate(updateData.getFollowUpDate());
            if (updateData.getNotes() != null) existing.setNotes(updateData.getNotes());
            if (updateData.getJobUrl() != null) existing.setJobUrl(updateData.getJobUrl());
            if (updateData.getIsExternal() != null) existing.setIsExternal(updateData.getIsExternal());
            
            Application saved = applicationRepository.save(existing);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApplication(@PathVariable int id) {
        try {
            Application existing = applicationRepository.getById(id);
            if (existing != null) {
                applicationRepository.deleteById(id);
                return ResponseEntity.ok("Application deleted successfully");
            }
            return ResponseEntity.status(404).body("Application not found");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting application: " + e.getMessage());
        }
    }
}

