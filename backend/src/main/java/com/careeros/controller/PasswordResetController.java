package com.placement.controller;

import com.placement.model.Student;
import com.placement.repository.StudentRepository;
import com.placement.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        Student student = studentRepository.findByEmail(email);
        if (student == null) {
            return ResponseEntity.ok("If the email exists, a reset link has been sent.");
        }

        String token = UUID.randomUUID().toString();
        student.setResetToken(token);
        studentRepository.update(student);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        String subject = "Password Reset Request";
        String bodyText = "Dear " + student.getName() + ",\n\n" +
                "Click the link below to reset your password:\n" +
                resetLink + "\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\nSmart Placement Team";

        if (emailService != null) {
            try {
                emailService.sendEmail(email, subject, bodyText);
            } catch (Exception e) {
                System.err.println("Failed to send reset email: " + e.getMessage());
            }
        }

        return ResponseEntity.ok("If the email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("password");

        if (token == null || token.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Token and password are required");
        }

        Student student = studentRepository.findByResetToken(token);
        if (student == null) {
            return ResponseEntity.status(404).body("Invalid or expired reset token");
        }

        student.setPassword(newPassword);
        student.setResetToken(null);
        studentRepository.update(student);

        return ResponseEntity.ok("Password reset successful");
    }
}

