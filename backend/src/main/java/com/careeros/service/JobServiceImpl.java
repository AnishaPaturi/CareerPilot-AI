package com.careeros.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class JobServiceImpl implements JobService {

    @Override
    public Object getJobs(String keyword, String source, String jobType) throws Exception {
        return List.of();
    }
}
