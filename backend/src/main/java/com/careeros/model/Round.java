package com.placement.model;

import java.sql.Date;

public class Round {
    private Integer id;
    private Integer driveId;
    private String roundName;
    private Date roundDate;

    public Round() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getDriveId() { return driveId; }
    public void setDriveId(Integer driveId) { this.driveId = driveId; }
    public String getRoundName() { return roundName; }
    public void setRoundName(String roundName) { this.roundName = roundName; }
    public Date getRoundDate() { return roundDate; }
    public void setRoundDate(Date roundDate) { this.roundDate = roundDate; }
}

