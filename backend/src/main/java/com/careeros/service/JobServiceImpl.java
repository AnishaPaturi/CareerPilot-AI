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
    public Object getJobs(String keyword, String location, String jobType) {
        List<Map<String, Object>> jobs = careerNestClient.searchJobs(
                keyword == null ? null : keyword.trim(),
                jobType == null ? null : jobType.trim(),
                50
        );
        return Map.of("data", jobs);
    }
}
