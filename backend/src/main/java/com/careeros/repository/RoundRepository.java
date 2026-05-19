package com.careeros.repository;

import com.careeros.model.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoundRepository extends JpaRepository<Round, Integer> {

    List<Round> findByDriveId(int driveId);

    default int create(Round round) {
        saveAndFlush(round);
        return round.getId();
    }

    default int modify(Round round) {
        save(round);
        return round.getId();
    }

    default int remove(int id) {
        Round existing = findById(Integer.valueOf(id)).orElse(null);
        if (existing != null) { delete(existing); return 1; }
        return 0;
    }
}
