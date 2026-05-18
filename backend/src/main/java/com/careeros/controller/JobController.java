package com.placement.controller;

import com.placement.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public Object getJobs(@RequestParam(required = false) String keyword,
                          @RequestParam(required = false) String source,
                          @RequestParam(required = false) String jobType) {
        try {
            return jobService.getJobs(keyword, source, jobType);
        } catch (Exception e) {
            return Collections.singletonMap("data", Collections.emptyList());
        }
    }
}