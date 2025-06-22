package ch.clip.trips.controller;

import ch.clip.trips.data.Expense;
import ch.clip.trips.service.ExpenseService;
import ch.clip.trips.service.TokenService;
import ch.clip.trips.service.CurrencyService;
import ch.clip.trips.service.UserService;
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
    @Autowired
    private UserService userService;

    @PostMapping("")
    public ResponseEntity<?> createExpense(@RequestHeader("Authorization") String token, @RequestBody Expense expense) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
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
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        
        Long userId = tokenService.getUserIdFromToken(token);
        String userRole = tokenService.getUserRoleFromToken(token);
        
        System.out.println("User ID: " + userId + ", Role: " + userRole + ", Trip ID: " + tripId);
        
        List<Expense> expenses;
        
        // Teamleads sehen alle Spesen, Mitarbeiter nur ihre eigenen
        if ("TEAMLEAD".equals(userRole)) {
            System.out.println("Teamlead accessing all expenses for trip: " + tripId);
            expenses = expenseService.getExpensesByTrip(tripId);
        } else {
            System.out.println("Mitarbeiter accessing own expenses for trip: " + tripId);
            expenses = expenseService.getExpensesByUserAndTrip(userId, tripId);
        }
        
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getExpensesByTrip(@RequestHeader("Authorization") String token, @PathVariable Long tripId) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        
        String userRole = tokenService.getUserRoleFromToken(token);
        
        // Nur Teamleads können alle Spesen einer Reise sehen
        if (!"TEAMLEAD".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Nur Teamleads können alle Spesen einer Reise einsehen");
        }
        
        List<Expense> expenses = expenseService.getExpensesByTrip(tripId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/sum/{tripId}")
    public ResponseEntity<?> getSumByUserAndTrip(@RequestHeader("Authorization") String token, @PathVariable Long tripId) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        
        Long userId = tokenService.getUserIdFromToken(token);
        String userRole = tokenService.getUserRoleFromToken(token);
        
        double sum;
        
        // Teamleads sehen die Summe aller Spesen, Mitarbeiter nur ihre eigenen
        if ("TEAMLEAD".equals(userRole)) {
            System.out.println("Teamlead calculating total sum for trip: " + tripId);
            sum = expenseService.sumExpensesByTrip(tripId);
        } else {
            System.out.println("Mitarbeiter calculating own sum for trip: " + tripId);
            sum = expenseService.sumExpensesByUserAndTrip(userId, tripId);
        }
        
        return ResponseEntity.ok(sum);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        
        Long userId = tokenService.getUserIdFromToken(token);
        String userRole = tokenService.getUserRoleFromToken(token);
        
        // Prüfen, ob der User die Spese löschen darf
        Expense expense = expenseService.getExpenseById(id);
        if (expense == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Spese nicht gefunden");
        }
        
        // Teamleads können alle Spesen löschen, Mitarbeiter nur ihre eigenen
        if (!"TEAMLEAD".equals(userRole) && !expense.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sie können nur Ihre eigenen Spesen löschen");
        }
        
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trip/{tripId}/converted")
    public ResponseEntity<?> getExpensesByTripConverted(@RequestHeader("Authorization") String token, @PathVariable Long tripId, @RequestParam String to) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        
        String userRole = tokenService.getUserRoleFromToken(token);
        
        // Nur Teamleads können alle Spesen einer Reise sehen
        if (!"TEAMLEAD".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Nur Teamleads können alle Spesen einer Reise einsehen");
        }
        
        List<Expense> expenses = expenseService.getExpensesByTrip(tripId);
        Map<Long, Double> userSums = new HashMap<>();
        for (Expense e : expenses) {
            double converted = currencyService.convert(e.getAmount(), e.getCurrency(), to);
            userSums.put(e.getUserId(), userSums.getOrDefault(e.getUserId(), 0.0) + converted);
        }
        return ResponseEntity.ok(userSums);
    }

    @PostMapping("/currency/convert")
    public ResponseEntity<?> convertCurrency(@RequestHeader("Authorization") String token, @RequestBody CurrencyConversionRequest request) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        
        try {
            double convertedAmount = currencyService.convert(request.getAmount(), request.getFromCurrency(), request.getToCurrency());
            Map<String, Object> response = new HashMap<>();
            response.put("convertedAmount", convertedAmount);
            response.put("fromCurrency", request.getFromCurrency());
            response.put("toCurrency", request.getToCurrency());
            response.put("originalAmount", request.getAmount());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Währungsumrechnung fehlgeschlagen: " + e.getMessage());
        }
    }

    public static class CurrencyConversionRequest {
        private double amount;
        private String fromCurrency;
        private String toCurrency;

        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getFromCurrency() { return fromCurrency; }
        public void setFromCurrency(String fromCurrency) { this.fromCurrency = fromCurrency; }
        public String getToCurrency() { return toCurrency; }
        public void setToCurrency(String toCurrency) { this.toCurrency = toCurrency; }
    }
} 