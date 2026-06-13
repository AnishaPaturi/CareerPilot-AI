package com.careeros.controller;

import com.careeros.model.Resume;
import com.careeros.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeRepository resumeRepository;

    @GetMapping("/student/{studentId}")
    public List<Resume> getStudentResumes(@PathVariable int studentId) {
        return resumeRepository.findByStudentId(studentId);
    }

    @PostMapping
    public ResponseEntity<Resume> saveResume(@RequestBody Resume resume) {
        try {
            // If resume label is empty, default it
            if (resume.getLabel() == null || resume.getLabel().trim().isEmpty()) {
                resume.setLabel("Resume Version " + (resumeRepository.findByStudentId(resume.getStudentId()).size() + 1));
            }
            Resume saved = resumeRepository.save(resume);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResume(@PathVariable int id) {
        try {
            Optional<Resume> resume = resumeRepository.findById(id);
            if (resume.isPresent()) {
                resumeRepository.deleteById(id);
                return ResponseEntity.ok("Resume deleted successfully");
            }
            return ResponseEntity.status(404).body("Resume not found");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting resume: " + e.getMessage());
        }
    }
}
