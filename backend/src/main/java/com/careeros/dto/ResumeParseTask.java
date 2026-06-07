package com.careeros.dto;

import java.io.Serializable;

public class ResumeParseTask implements Serializable {
    private static final long serialVersionUID = 1L;

    private int studentId;
    private String filePath;
    private String originalFileName;
    private String targetRole;

    public ResumeParseTask() {}

    public ResumeParseTask(int studentId, String filePath, String originalFileName, String targetRole) {
        this.studentId = studentId;
        this.filePath = filePath;
        this.originalFileName = originalFileName;
        this.targetRole = targetRole;
    }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    @Override
    public String toString() {
        return "ResumeParseTask{" +
                "studentId=" + studentId +
                ", filePath='" + filePath + '\'' +
                ", originalFileName='" + originalFileName + '\'' +
                ", targetRole='" + targetRole + '\'' +
                '}';
    }
}
