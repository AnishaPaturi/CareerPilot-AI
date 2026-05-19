package com.careeros.controller;

import com.careeros.model.Admin;
import com.careeros.model.Student;
import com.careeros.repository.AdminRepository;
import com.careeros.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // Check Admin First
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null && matchesPassword(password, admin.getPassword())) {
            response.put("success", true);
            response.put("role", "ADMIN");
            response.put("user", admin);
            return ResponseEntity.ok(response);
        }

        // Check Student Second
        Student student = studentRepository.findByEmail(email);
        if (student != null && matchesPassword(password, student.getPassword())) {
            response.put("success", true);
            response.put("role", "STUDENT");
            response.put("user", student);
            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String password = payload.get("password");

        Map<String, Object> response = new HashMap<>();

        if (studentRepository.findByEmail(email) != null || adminRepository.findByEmail(email) != null) {
            response.put("success", false);
            response.put("message", "Email already in use");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Student student = new Student();
        student.setName(name);
        student.setEmail(email);
        
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        student.setPassword(encoder.encode(password));
        
        studentRepository.save(student);

        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("role", "STUDENT");
        response.put("user", student);

        return ResponseEntity.ok(response);
    }

    private boolean matchesPassword(String raw, String stored) {
        if (stored != null && stored.startsWith("$2a$10$")) {
            return new BCryptPasswordEncoder().matches(raw, stored);
        }
        return raw.equals(stored);
    }
}

