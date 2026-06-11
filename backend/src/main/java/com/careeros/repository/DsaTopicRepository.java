package com.careeros.repository;

import com.careeros.model.DsaTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DsaTopicRepository extends JpaRepository<DsaTopic, Integer> {
    List<DsaTopic> findByCategory(String category);
}
