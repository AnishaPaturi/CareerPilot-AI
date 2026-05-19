package com.careeros.service;

import com.careeros.model.Drive;
import com.careeros.model.Student;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShortlistingAlgorithm {

    public List<Student> shortlist(List<Student> students, Drive drive) {
        if (students == null) {
            return Collections.emptyList();
        }
        return students.stream()
                .sorted((s1, s2) -> {
                    Double cgpa1 = s1.getCgpa() != null ? s1.getCgpa() : 0.0;
                    Double cgpa2 = s2.getCgpa() != null ? s2.getCgpa() : 0.0;
                    return cgpa2.compareTo(cgpa1);
                })
                .collect(Collectors.toList());
    }
}
