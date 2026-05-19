package com.careeros.repository;

import com.careeros.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    List<Application> findByStudentId(int studentId);
    List<Application> findByDriveId(int driveId);

    @Modifying
    @Query("UPDATE Application a SET a.status = :status WHERE a.id = :id")
    int updateStatus(int id, String status);

    default Application getById(int id) {
        return findById(Integer.valueOf(id)).orElse(null);
    }
}
