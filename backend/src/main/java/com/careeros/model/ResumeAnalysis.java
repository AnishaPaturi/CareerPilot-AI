package com.placement.model;

import java.sql.Timestamp;

public class ResumeAnalysis {
    private Integer id;
    private Integer studentId;
    private String skills;
    private String certifications;
    private Double cgpa;
    private String education;
    private String experience;
    private String projects;
    private String summary;
    private String rawAnalysis;
    private Timestamp createdAt;

    public ResumeAnalysis() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }
    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getRawAnalysis() { return rawAnalysis; }
    public void setRawAnalysis(String rawAnalysis) { this.rawAnalysis = rawAnalysis; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}

