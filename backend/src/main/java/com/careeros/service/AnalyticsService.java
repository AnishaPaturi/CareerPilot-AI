package com.careeros.service;

import com.careeros.model.Application;
import com.careeros.model.Company;
import com.careeros.repository.ApplicationRepository;
import com.careeros.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<Map<String, Object>> getTopHiringCompanies() {
        List<Company> companies = companyRepository.findAll();
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (Company company : companies) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("companyName", company.getName());
            entry.put("totalHired", 0);
            result.add(entry);
        }
        return result;
    }

    public long getTotalPlacedStudents() {
        return applicationRepository.findAll().stream()
                .filter(a -> a.getStatus() == com.careeros.model.ApplicationStatus.SELECTED)
                .count();
    }

    public double getAveragePackage() {
        return 0.0;
    }
}
