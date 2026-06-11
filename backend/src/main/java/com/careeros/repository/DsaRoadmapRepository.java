package com.careeros.repository;

import com.careeros.model.DsaRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DsaRoadmapRepository extends JpaRepository<DsaRoadmap, Integer> {
    List<DsaRoadmap> findByStudentId(Integer studentId);
}
