package ch.clip.trips.controller;

import ch.clip.trips.model.BusinessTrip;
import ch.clip.trips.repository.BusinessTripRepository;
import ch.clip.trips.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
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
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Long userId = tokenService.getUserIdFromToken(token);
        Optional<BusinessTrip> trip = businessTripRepository.findById(id);
        return trip.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("")
    public ResponseEntity<List<BusinessTrip>> getAllTrips(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<BusinessTrip> trips = businessTripRepository.findAll();
        return ResponseEntity.ok(trips);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusinessTrip> updateTrip(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody BusinessTrip trip) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<BusinessTrip> existingTrip = businessTripRepository.findById(id);
        if (existingTrip.isPresent()) {
            trip.setId(id);
            BusinessTrip updatedTrip = businessTripRepository.save(trip);
            return ResponseEntity.ok(updatedTrip);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (businessTripRepository.existsById(id)) {
            businessTripRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Weitere Methoden wie update, delete, etc.
}