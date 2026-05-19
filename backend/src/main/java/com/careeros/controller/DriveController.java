package com.careeros.controller;

import com.careeros.model.Application;
import com.careeros.model.Drive;
import com.careeros.model.Student;
import com.careeros.repository.ApplicationRepository;
import com.careeros.repository.DriveRepository;
import com.careeros.repository.StudentRepository;
import com.careeros.service.EligibilityEngine;
import com.careeros.service.ShortlistingAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/drives")
public class DriveController {

    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EligibilityEngine eligibilityEngine;

    @Autowired
    private ShortlistingAlgorithm shortlistingAlgorithm;

    @PostMapping
    public ResponseEntity<String> createDrive(@RequestBody Drive drive) {
        driveRepository.save(drive);
        return ResponseEntity.ok("Drive created successfully");
    }

    @GetMapping
    public List<Drive> getAllDrives() {
        return driveRepository.findAll();
    }

    @PostMapping("/{driveId}/apply/{studentId}")
    public ResponseEntity<String> applyForDrive(@PathVariable int driveId, @PathVariable int studentId) {
        Application app = new Application();
        app.setDriveId(driveId);
        app.setStudentId(studentId);
        app.setStatus(com.careeros.model.ApplicationStatus.APPLIED);
        applicationRepository.save(app);
        return ResponseEntity.ok("Applied successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateDrive(@PathVariable int id, @RequestBody Drive drive) {
        drive.setId(id);
        Drive existing = driveRepository.getById(id);
        if (existing == null) {
            return ResponseEntity.status(404).body("Drive not found");
        }
        driveRepository.save(drive);
        return ResponseEntity.ok("Drive updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDrive(@PathVariable int id) {
        Drive existing = driveRepository.getById(id);
        int result = existing != null ? 1 : 0;
        if (existing != null) {
            driveRepository.delete(existing);
        }
        if (result > 0) {
            return ResponseEntity.ok("Drive deleted successfully");
        }
        return ResponseEntity.status(404).body("Drive not found");
    }

    @PostMapping("/{driveId}/shortlist")
    public List<Student> shortlistForDrive(@PathVariable int driveId) {
        Drive drive = driveRepository.getById(driveId);

        List<Application> applications = applicationRepository.findByDriveId(driveId);
        List<Integer> applicantIds = applications.stream().map(Application::getStudentId).collect(Collectors.toList());

        List<Student> allApplicants = studentRepository.findAll().stream()
                .filter(s -> applicantIds.contains(s.getId()))
                .collect(Collectors.toList());

        List<Student> eligible = eligibilityEngine.filterEligibleStudents(allApplicants, drive);
        List<Student> shortlisted = shortlistingAlgorithm.shortlist(eligible, drive);

        for (Student s : shortlisted) {
            Application app = applications.stream().filter(a -> a.getStudentId().equals(s.getId())).findFirst().orElse(null);
            if (app != null) {
                applicationRepository.updateStatus(app.getId(), "SHORTLISTED");
            }
        }

        return shortlisted;
    }
}

