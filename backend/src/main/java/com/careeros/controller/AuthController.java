package com.careeros.controller;

import com.careeros.model.Admin;
import com.careeros.model.Student;
import com.careeros.model.User;
import com.careeros.repository.AdminRepository;
import com.careeros.repository.StudentRepository;
import com.careeros.repository.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();

        // 1. Check Unified Users Table
        User user = userRepository.findByEmail(email);
        if (user != null && matchesPassword(password, user.getPassword())) {
            response.put("success", true);
            response.put("role", user.getRole().name());
            
            if (user.getRole() == User.Role.STUDENT) {
                Student student = studentRepository.findByEmail(email);
                if (student == null) {
                    // Create student profile record automatically if missing
                    student = new Student();
                    student.setName(user.getName());
                    student.setEmail(user.getEmail());
                    student.setPassword(user.getPassword());
                    student = studentRepository.save(student);
                }
                response.put("user", student);
            } else {
                response.put("user", user);
            }
            return ResponseEntity.ok(response);
        }

        // 2. Check Admin Fallback
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null && matchesPassword(password, admin.getPassword())) {
            response.put("success", true);
            response.put("role", "ADMIN");
            response.put("user", admin);
            return ResponseEntity.ok(response);
        }

        // 3. Check Student Fallback
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
        String roleStr = payload.getOrDefault("role", "STUDENT");

        Map<String, Object> response = new HashMap<>();

        if (userRepository.findByEmail(email) != null || 
            studentRepository.findByEmail(email) != null || 
            adminRepository.findByEmail(email) != null) {
            response.put("success", false);
            response.put("message", "Email already in use");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(password);

        // Save in Unified Users Table
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(hashedPassword);
        
        User.Role role = User.Role.STUDENT;
        try {
            role = User.Role.valueOf(roleStr.toUpperCase());
        } catch (Exception e) {
            // fallback to student
        }
        user.setRole(role);
        userRepository.save(user);

        // If Student, also save in Students profile table
        if (role == User.Role.STUDENT) {
            Student student = new Student();
            student.setName(name);
            student.setEmail(email);
            student.setPassword(hashedPassword);
            studentRepository.save(student);
            
            response.put("user", student);
        } else {
            response.put("user", user);
        }

        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("role", role.name());

        return ResponseEntity.ok(response);
    }

    private boolean matchesPassword(String raw, String stored) {
        if (stored != null && stored.startsWith("$2a$10$")) {
            return new BCryptPasswordEncoder().matches(raw, stored);
        }
        return raw.equals(stored);
    }
}

