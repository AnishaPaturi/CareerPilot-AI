package com.placement.model;

import java.sql.Timestamp;

public class Application {
    private Integer id;
    private Integer studentId;
    private Integer driveId;
    private ApplicationStatus status;
    private Timestamp appliedOn;
    
    private String studentName;
    private String companyName;
    private String role;

    public Application() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }
    public Integer getDriveId() { return driveId; }
    public void setDriveId(Integer driveId) { this.driveId = driveId; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public Timestamp getAppliedOn() { return appliedOn; }
    public void setAppliedOn(Timestamp appliedOn) { this.appliedOn = appliedOn; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

