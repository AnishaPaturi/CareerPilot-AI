package com.placement.controller;

import com.placement.model.Application;
import com.placement.model.Student;
import com.placement.repository.ApplicationRepository;
import com.placement.repository.StudentRepository;
import com.placement.service.EmailService;
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
            Application app = applicationRepository.findById(id);
            if (app != null) {
                Student student = studentRepository.findById(app.getStudentId());
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
}

