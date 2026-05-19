package com.careeros.controller;

import com.careeros.model.Interview;
import com.careeros.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewRepository interviewRepository;

    @GetMapping
    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    @GetMapping("/drive/{driveId}")
    public List<Interview> getByDriveId(@PathVariable int driveId) {
        return interviewRepository.findByDriveId(driveId);
    }

    @PostMapping
    public ResponseEntity<String> createInterview(@RequestBody Interview interview) {
        int result = interviewRepository.create(interview);
        if (result > 0) {
            return ResponseEntity.ok("Interview scheduled successfully");
        }
        return ResponseEntity.internalServerError().body("Failed to schedule interview");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateInterview(@PathVariable int id, @RequestBody Interview interview) {
        interview.setId(id);
        int result = interviewRepository.modify(interview);
        if (result > 0) {
            return ResponseEntity.ok("Interview updated successfully");
        }
        return ResponseEntity.status(404).body("Interview not found");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInterview(@PathVariable int id) {
        int result = interviewRepository.remove(id);
        if (result > 0) {
            return ResponseEntity.ok("Interview deleted successfully");
        }
        return ResponseEntity.status(404).body("Interview not found");
    }
}

