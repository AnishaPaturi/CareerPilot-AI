package com.careeros.repository;

import com.careeros.model.DsaProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DsaProgressRepository extends JpaRepository<DsaProgress, Integer> {
    List<DsaProgress> findByStudentId(Integer studentId);
    Optional<DsaProgress> findByStudentIdAndTopicId(Integer studentId, Integer topicId);
}
