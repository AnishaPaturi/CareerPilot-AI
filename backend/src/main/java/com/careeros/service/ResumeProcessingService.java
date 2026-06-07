package com.careeros.service;

import com.careeros.model.ResumeAnalysis;
import com.careeros.model.Student;
import com.careeros.repository.ResumeAnalysisRepository;
import com.careeros.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
public class ResumeProcessingService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    @Autowired
    private AiService aiService;

    public Map<String, Object> processAndSaveResume(int studentId, MultipartFile file) {
        Map<String, Object> aiResult = aiService.parseResumeForProfile(file);

        Student student = studentRepository.getById(studentId);
        if (student == null) {
            throw new RuntimeException("Student not found for ID: " + studentId);
        }

        String skills = (String) aiResult.getOrDefault("skills", "");
        String certifications = (String) aiResult.getOrDefault("certifications", "");
        Object cgpaObj = aiResult.get("cgpa");
        Double cgpa = cgpaObj instanceof Number ? ((Number) cgpaObj).doubleValue() : null;
        String education = (String) aiResult.getOrDefault("education", "");
        String experience = (String) aiResult.getOrDefault("experience", "");
        String projects = (String) aiResult.getOrDefault("projects", "");
        String summary = (String) aiResult.getOrDefault("summary", "");

        student.setSkills(skills);
        student.setCertifications(certifications);
        if (cgpa != null) student.setCgpa(cgpa);
        student.setResumeUrl(file.getOriginalFilename());
        student.setEducation(education);
        student.setExperience(experience);
        student.setProjects(projects);
        student.setSummary(summary);
        studentRepository.save(student);

        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setStudentId(studentId);
        analysis.setSkills(skills);
        analysis.setCertifications(certifications);
        analysis.setCgpa(cgpa);
        analysis.setEducation(education);
        analysis.setExperience(experience);
        analysis.setProjects(projects);
        analysis.setSummary(summary);
        analysis.setRawAnalysis(aiResult.toString());
        resumeAnalysisRepository.save(analysis);

        Map<String, Object> parsedData = new HashMap<>();
        parsedData.put("skills", skills);
        parsedData.put("certifications", certifications);
        parsedData.put("cgpa", cgpa);
        parsedData.put("education", education);
        parsedData.put("experience", experience);
        parsedData.put("projects", projects);
        parsedData.put("summary", summary);
        parsedData.put("resumeUrl", file.getOriginalFilename());
        parsedData.put("success", true);
        parsedData.put("message", "Resume parsed successfully by AI Engine.");

        return parsedData;
    }
}
