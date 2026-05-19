package com.careeros.repository;

import com.careeros.model.Drive;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriveRepository extends JpaRepository<Drive, Integer> {
    default Drive getById(int id) { return findById(Integer.valueOf(id)).orElse(null); }
}
