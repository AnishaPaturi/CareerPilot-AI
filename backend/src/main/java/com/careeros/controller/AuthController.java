package com.placement.controller;

import com.placement.model.Admin;
import com.placement.model.Student;
import com.placement.repository.AdminRepository;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();

        // Check Admin First
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null && admin.getPassword().equals(password)) {
            response.put("success", true);
            response.put("role", "ADMIN");
            response.put("user", admin);
            return ResponseEntity.ok(response);
        }

        // Check Student Second
        Student student = studentRepository.findByEmail(email);
        if (student != null && student.getPassword().equals(password)) {
            response.put("success", true);
            response.put("role", "STUDENT");
            response.put("user", student);
            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}

