package ch.clip.trips.controller;

import ch.clip.trips.model.BusinessTrip;
import ch.clip.trips.service.BusinessTripService;
import ch.clip.trips.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
public class BuisnesTripUserController {
    private final BusinessTripService businessTripService;
    private final TokenService tokenService;

    @Autowired
    public BuisnesTripUserController(BusinessTripService businessTripService, TokenService tokenService) {
        this.businessTripService = businessTripService;
        this.tokenService = tokenService;
    }

    @GetMapping()
    public ResponseEntity<List<BusinessTrip>> getAllTrips(@RequestHeader("Authorization") String token) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = tokenService.getUserIdFromToken(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<BusinessTrip> trips = businessTripService.getTripsByUserId(userId);
        return ResponseEntity.ok(trips);
    }
}
