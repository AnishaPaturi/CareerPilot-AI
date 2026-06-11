package com.careeros.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "ats_score")
    private Integer atsScore;

    @Column(name = "skills_match", columnDefinition = "json")
    private String skillsMatch;

    @Column(name = "missing_skills", columnDefinition = "json")
    private String missingSkills;

    @Column(name = "suggestions", columnDefinition = "json")
    private String suggestions;

    @Column(name = "raw_analysis", columnDefinition = "TEXT")
    private String rawAnalysis;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Timestamp createdAt;

    // Legacy fields kept for backward compatibility with ResumeProcessingService
    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    private Double cgpa;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String projects;

    @Column(columnDefinition = "TEXT")
    private String summary;

    public ResumeAnalysis() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Integer getAtsScore() { return atsScore; }
    public void setAtsScore(Integer atsScore) { this.atsScore = atsScore; }

    public String getSkillsMatch() { return skillsMatch; }
    public void setSkillsMatch(String skillsMatch) { this.skillsMatch = skillsMatch; }

    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }

    public String getSuggestions() { return suggestions; }
    public void setSuggestions(String suggestions) { this.suggestions = suggestions; }

    public String getRawAnalysis() { return rawAnalysis; }
    public void setRawAnalysis(String rawAnalysis) { this.rawAnalysis = rawAnalysis; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

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
}
