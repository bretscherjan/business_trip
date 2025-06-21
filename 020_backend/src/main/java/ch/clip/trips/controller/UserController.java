package ch.clip.trips.controller;

import ch.clip.trips.data.User;
import ch.clip.trips.repository.UserRepository;
import ch.clip.trips.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;

    @GetMapping("")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<?> exportUsersAsCsv(@RequestHeader("Authorization") String token) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig");
        }
        Long userId = tokenService.getUserIdFromToken(token);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getRole() != User.Role.TEAMLEAD) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Keine Berechtigung");
        }
        List<User> users = userRepository.findAll();
        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append("Username,Email,Telefonnummer,Rolle\n");
        for (User u : users) {
            csvBuilder.append(u.getUsername()).append(",")
                      .append(u.getEmail()).append(",")
                      .append(u.getPhoneNumber() != null ? u.getPhoneNumber() : "").append(",")
                      .append(u.getRole()).append("\n");
        }
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=teilnehmerliste.csv")
                .header("Content-Type", "text/csv")
                .body(csvBuilder.toString());
    }
} 