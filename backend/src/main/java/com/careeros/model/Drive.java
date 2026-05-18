package com.placement.model;

import java.sql.Date;

public class Drive {
    private Integer id;
    private Integer companyId;
    private String role;
    private Double packageLpa;
    private Double minCgpa;
    private String allowedBranches;
    private Date driveDate;
    
    private String companyName;

    public Drive() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getCompanyId() { return companyId; }
    public void setCompanyId(Integer companyId) { this.companyId = companyId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Double getPackageLpa() { return packageLpa; }
    public void setPackageLpa(Double packageLpa) { this.packageLpa = packageLpa; }
    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }
    public String getAllowedBranches() { return allowedBranches; }
    public void setAllowedBranches(String allowedBranches) { this.allowedBranches = allowedBranches; }
    public Date getDriveDate() { return driveDate; }
    public void setDriveDate(Date driveDate) { this.driveDate = driveDate; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
}

