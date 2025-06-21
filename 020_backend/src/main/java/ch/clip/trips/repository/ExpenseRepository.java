package ch.clip.trips.repository;

import ch.clip.trips.data.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);
    List<Expense> findByTripId(Long tripId);
    List<Expense> findByUserIdAndTripId(Long userId, Long tripId);
} 