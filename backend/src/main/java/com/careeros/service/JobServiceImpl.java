package com.careeros.service;

import com.careeros.service.careernest.CareerNestClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class JobServiceImpl implements JobService {

    private final CareerNestClient careerNestClient;

    public JobServiceImpl(CareerNestClient careerNestClient) {
        this.careerNestClient = careerNestClient;
    }

    @Override
    public Object getJobs(String keyword, String source, String jobType) {
        // keyword is the job title / search query; location is passed via source param
        String location = (source != null && !source.isBlank() && !source.equalsIgnoreCase("all"))
                ? source : null;
        List<Map<String, Object>> jobs = careerNestClient.searchJobs(
                keyword == null ? null : keyword.trim(),
                location,
                jobType == null ? null : jobType.trim(),
                50                     // max results per call
        );
        return Map.of("data", jobs);   // {"data":[...]} shape expected by Dashboard JSX
    }
}
