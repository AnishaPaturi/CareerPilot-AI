package com.careeros.repository;

import com.careeros.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Integer> {

    List<Interview> findByDriveId(int driveId);

    default int create(Interview interview) {
        saveAndFlush(interview);
        return interview.getId();
    }

    default int modify(Interview interview) {
        save(interview);
        return interview.getId();
    }

    default int remove(int id) {
        Interview existing = findById(Integer.valueOf(id)).orElse(null);
        if (existing != null) { delete(existing); return 1; }
        return 0;
    }
}
