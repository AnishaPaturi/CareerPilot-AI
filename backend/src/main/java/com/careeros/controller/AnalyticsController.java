package com.placement.controller;

import com.placement.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardData() {
        Map<String, Object> response = new HashMap<>();
        response.put("topCompanies", analyticsService.getTopHiringCompanies());
        response.put("totalPlaced", analyticsService.getTotalPlacedStudents());
        response.put("averagePackage", analyticsService.getAveragePackage());
        return response;
    }
}

