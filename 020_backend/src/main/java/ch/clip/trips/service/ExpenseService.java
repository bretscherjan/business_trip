package ch.clip.trips.service;

import ch.clip.trips.data.Expense;
import ch.clip.trips.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByUserAndTrip(Long userId, Long tripId) {
        return expenseRepository.findByUserIdAndTripId(userId, tripId);
    }

    public List<Expense> getExpensesByTrip(Long tripId) {
        return expenseRepository.findByTripId(tripId);
    }

    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public double sumExpensesByUserAndTrip(Long userId, Long tripId) {
        return expenseRepository.findByUserIdAndTripId(userId, tripId)
                .stream().mapToDouble(Expense::getAmount).sum();
    }
} 