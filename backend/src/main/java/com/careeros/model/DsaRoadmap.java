package com.careeros.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dsa_roadmaps")
public class DsaRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(length = 100)
    private String title;

    @Column(name = "target_company", length = 100)
    private String targetCompany;

    @Column(name = "timeline_days")
    private Integer timelineDays;

    @Column(name = "daily_goals", columnDefinition = "json")
    private String dailyGoals;

    @Column(name = "weak_areas", columnDefinition = "json")
    private String weakAreas;

    @Enumerated(EnumType.STRING)
    private RoadmapStatus status = RoadmapStatus.ACTIVE;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public DsaRoadmap() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTargetCompany() { return targetCompany; }
    public void setTargetCompany(String targetCompany) { this.targetCompany = targetCompany; }

    public Integer getTimelineDays() { return timelineDays; }
    public void setTimelineDays(Integer timelineDays) { this.timelineDays = timelineDays; }

    public String getDailyGoals() { return dailyGoals; }
    public void setDailyGoals(String dailyGoals) { this.dailyGoals = dailyGoals; }

    public String getWeakAreas() { return weakAreas; }
    public void setWeakAreas(String weakAreas) { this.weakAreas = weakAreas; }

    public RoadmapStatus getStatus() { return status; }
    public void setStatus(RoadmapStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public enum RoadmapStatus {
        ACTIVE, COMPLETED, PAUSED
    }
}
