package com.careeros.repository;

import com.careeros.model.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Integer> {
    List<ResumeAnalysis> findByStudentId(int studentId);
}
