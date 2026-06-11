package com.careeros.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "dsa_progress")
public class DsaProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "topic_id")
    private Integer topicId;

    @Column(name = "problems_solved")
    private Integer problemsSolved = 0;

    @Column(name = "last_practiced")
    private LocalDate lastPracticed;

    @Column(name = "confidence_score")
    private Integer confidenceScore;

    public DsaProgress() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Integer getTopicId() { return topicId; }
    public void setTopicId(Integer topicId) { this.topicId = topicId; }

    public Integer getProblemsSolved() { return problemsSolved; }
    public void setProblemsSolved(Integer problemsSolved) { this.problemsSolved = problemsSolved; }

    public LocalDate getLastPracticed() { return lastPracticed; }
    public void setLastPracticed(LocalDate lastPracticed) { this.lastPracticed = lastPracticed; }

    public Integer getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Integer confidenceScore) { this.confidenceScore = confidenceScore; }
}
