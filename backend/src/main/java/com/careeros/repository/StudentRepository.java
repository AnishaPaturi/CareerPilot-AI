package com.careeros.repository;

import com.careeros.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Student findByEmail(String email);
    Student findByResetToken(String resetToken);
    default Student findById(int id) {
        return findById(Integer.valueOf(id)).orElse(null);
    }
    default int update(Student student) {
        save(student);
        return 1;
    }
}
