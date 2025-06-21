package ch.clip.trips.controller;

import ch.clip.trips.model.BusinessTrip;
import ch.clip.trips.repository.BusinessTripRepository;
import ch.clip.trips.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/trips")
public class BusinessTripUserController {

    @Autowired
    private BusinessTripRepository businessTripRepository;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity<BusinessTrip> createTrip(@RequestHeader("Authorization") String token, @RequestBody BusinessTrip trip) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Long userId = tokenService.getUserIdFromToken(token);
        // trip.setUserId(userId);
        // trip.setId(null); // ID wird von der Datenbank generiert
        BusinessTrip savedTrip = businessTripRepository.save(trip);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTrip);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessTrip> getTrip(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Long userId = tokenService.getUserIdFromToken(token);
        Optional<BusinessTrip> trip = businessTripRepository.findById(id);
        return trip.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Weitere Methoden wie update, delete, etc.
}