package com.careeros.controller;

import com.careeros.model.MockInterview;
import com.careeros.repository.MockInterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mock-interviews")
public class MockInterviewController {

    @Autowired
    private MockInterviewRepository mockInterviewRepository;

    @GetMapping("/student/{studentId}")
    public List<MockInterview> getStudentMockInterviews(@PathVariable int studentId) {
        return mockInterviewRepository.findByStudentId(studentId);
    }

    @PostMapping
    public ResponseEntity<MockInterview> saveMockInterview(@RequestBody MockInterview mockInterview) {
        try {
            MockInterview saved = mockInterviewRepository.save(mockInterview);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
