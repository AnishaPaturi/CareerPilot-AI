package com.careeros.service;

import java.util.List;
import java.util.Map;

public interface JobService {
    Object getJobs(String keyword, String source, String jobType) throws Exception;
}
