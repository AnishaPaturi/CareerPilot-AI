package com.careeros.repository;

import com.careeros.model.QueryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QueryLogRepository extends JpaRepository<QueryLog, Integer> {
    List<QueryLog> findByUserId(Integer userId);
    List<QueryLog> findByUserIdAndDocumentId(Integer userId, Integer documentId);
}
