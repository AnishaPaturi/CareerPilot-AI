package com.careeros.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "application_id")
    private Integer applicationId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "drive_id", nullable = false)
    private Integer driveId;

    @Column(length = 100)
    private String round;

    @Column(name = "interview_date_time")
    private LocalDateTime interviewDateTime;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Integer score;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Transient
    private String driveName;

    @Transient
    private String studentName;

    public Interview() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getApplicationId() { return applicationId; }
    public void setApplicationId(Integer applicationId) { this.applicationId = applicationId; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Integer getDriveId() { return driveId; }
    public void setDriveId(Integer driveId) { this.driveId = driveId; }

    public String getRound() { return round; }
    public void setRound(String round) { this.round = round; }

    public LocalDateTime getInterviewDateTime() { return interviewDateTime; }
    public void setInterviewDateTime(LocalDateTime interviewDateTime) { this.interviewDateTime = interviewDateTime; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public InterviewStatus getStatus() { return status; }
    public void setStatus(InterviewStatus status) { this.status = status; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getDriveName() { return driveName; }
    public void setDriveName(String driveName) { this.driveName = driveName; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public enum InterviewStatus {
        SCHEDULED, COMPLETED, MISSED, CANCELLED
    }
}
