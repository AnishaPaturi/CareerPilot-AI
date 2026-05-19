package com.careeros.repository;

import com.careeros.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Admin findByEmail(String email);
    default Admin findById(int id) { return findById(Integer.valueOf(id)).orElse(null); }
    default int update(Admin admin) { save(admin); return 1; }
}
