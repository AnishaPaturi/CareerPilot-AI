package com.careeros.repository;

import com.careeros.model.MockInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MockInterviewRepository extends JpaRepository<MockInterview, Integer> {
    List<MockInterview> findByStudentId(Integer studentId);
}
