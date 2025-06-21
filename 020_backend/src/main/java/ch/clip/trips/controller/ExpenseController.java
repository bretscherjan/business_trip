package ch.clip.trips.controller;

import ch.clip.trips.data.Expense;
import ch.clip.trips.service.ExpenseService;
import ch.clip.trips.service.TokenService;
import ch.clip.trips.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private CurrencyService currencyService;

    @PostMapping("")
    public ResponseEntity<?> createExpense(@RequestHeader("Authorization") String token, @RequestBody Expense expense) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        Long userId = tokenService.getUserIdFromToken(token);
        expense.setUserId(userId);
        if (expense.getDate() == null) expense.setDate(LocalDate.now());
        Expense saved = expenseService.createExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/user/{tripId}")
    public ResponseEntity<?> getExpensesByUserAndTrip(@RequestHeader("Authorization") String token, @PathVariable Long tripId) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        Long userId = tokenService.getUserIdFromToken(token);
        List<Expense> expenses = expenseService.getExpensesByUserAndTrip(userId, tripId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getExpensesByTrip(@RequestHeader("Authorization") String token, @PathVariable Long tripId) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        List<Expense> expenses = expenseService.getExpensesByTrip(tripId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/sum/{tripId}")
    public ResponseEntity<?> getSumByUserAndTrip(@RequestHeader("Authorization") String token, @PathVariable Long tripId) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        Long userId = tokenService.getUserIdFromToken(token);
        double sum = expenseService.sumExpensesByUserAndTrip(userId, tripId);
        return ResponseEntity.ok(sum);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trip/{tripId}/converted")
    public ResponseEntity<?> getExpensesByTripConverted(@RequestHeader("Authorization") String token, @PathVariable Long tripId, @RequestParam String to) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        List<Expense> expenses = expenseService.getExpensesByTrip(tripId);
        Map<Long, Double> userSums = new HashMap<>();
        for (Expense e : expenses) {
            double converted = currencyService.convert(e.getAmount(), e.getCurrency(), to);
            userSums.put(e.getUserId(), userSums.getOrDefault(e.getUserId(), 0.0) + converted);
        }
        return ResponseEntity.ok(userSums);
    }
} 