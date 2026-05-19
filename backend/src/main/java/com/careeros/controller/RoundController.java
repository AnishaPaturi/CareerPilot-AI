package com.careeros.controller;

import com.careeros.model.Round;
import com.careeros.repository.RoundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rounds")
public class RoundController {

    @Autowired
    private RoundRepository roundRepository;

    @GetMapping("/drive/{driveId}")
    public List<Round> getRoundsByDrive(@PathVariable int driveId) {
        return roundRepository.findByDriveId(driveId);
    }

    @PostMapping
    public ResponseEntity<String> createRound(@RequestBody Round round) {
        int result = roundRepository.create(round);
        if (result > 0) {
            return ResponseEntity.ok("Round created successfully");
        }
        return ResponseEntity.internalServerError().body("Failed to create round");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateRound(@PathVariable int id, @RequestBody Round round) {
        round.setId(id);
        int result = roundRepository.modify(round);
        if (result > 0) {
            return ResponseEntity.ok("Round updated successfully");
        }
        return ResponseEntity.status(404).body("Round not found");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRound(@PathVariable int id) {
        int result = roundRepository.remove(id);
        if (result > 0) {
            return ResponseEntity.ok("Round deleted successfully");
        }
        return ResponseEntity.status(404).body("Round not found");
    }
}

