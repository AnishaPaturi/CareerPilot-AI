package com.placement.model;

public class Interview {
    private Integer id;
    private Integer driveId;
    private Integer studentId;
    private String round;
    private String interviewDateTime;
    private String location;
    private String notes;
    private String driveName;
    private String studentName;

    public Interview() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getDriveId() { return driveId; }
    public void setDriveId(Integer driveId) { this.driveId = driveId; }
    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }
    public String getRound() { return round; }
    public void setRound(String round) { this.round = round; }
    public String getInterviewDateTime() { return interviewDateTime; }
    public void setInterviewDateTime(String interviewDateTime) { this.interviewDateTime = interviewDateTime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getDriveName() { return driveName; }
    public void setDriveName(String driveName) { this.driveName = driveName; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
}

