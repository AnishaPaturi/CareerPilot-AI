package com.careeros.service;

import com.careeros.model.Drive;
import com.careeros.model.Student;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EligibilityEngine {

    public List<Student> filterEligibleStudents(List<Student> students, Drive drive) {
        if (students == null || drive == null) {
            return Collections.emptyList();
        }
        return students.stream()
                .filter(s -> {
                    if (drive.getMinCgpa() != null && s.getCgpa() != null) {
                        return s.getCgpa() >= drive.getMinCgpa();
                    }
                    return true;
                })
                .filter(s -> {
                    if (s.getActiveBacklogs() != null) {
                        return s.getActiveBacklogs() == 0;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }
}
