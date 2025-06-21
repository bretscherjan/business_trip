package ch.clip.trips.controller;

import ch.clip.trips.data.PackingListGenerationData;
import ch.clip.trips.data.PackingListItem;
import ch.clip.trips.data.PackingListItemData;
import ch.clip.trips.repository.PackingListItemRepository;
import ch.clip.trips.repository.UserRepository;
import ch.clip.trips.service.GeneratePackigList;
import ch.clip.trips.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/PackingList")
public class AIPackingListController {

    @Autowired
    private PackingListItemRepository packingListItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @GetMapping("")
    public ResponseEntity<List<PackingListItemData>> getPackingList(@RequestHeader("Authorization") String token,
                                                       @RequestParam Long tripId) {
        // Remove "Bearer " prefix if present
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        
        System.out.println("Received token: " + token);
        System.out.println("Actual token: " + actualToken);
        System.out.println("Token validation result: " + tokenService.validateToken(actualToken));
        
        if (!tokenService.validateToken(actualToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(actualToken);
        System.out.println("User ID from token: " + userId);
        
        // Validate that user exists
        if (!userRepository.existsById(userId)) {
            System.out.println("User with ID " + userId + " does not exist in database");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<PackingListItem> items = packingListItemRepository.findByUserIdAndTripId(userId, tripId);
        
        List<PackingListItemData> responseItems = items.stream()
            .map(item -> {
                PackingListItemData data = new PackingListItemData();
                data.setId(item.getId());
                data.setName(item.getName());
                data.setTickedOff(item.isTickedOff());
                return data;
            })
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(responseItems);
    }

    @PostMapping("/Generate")
    public ResponseEntity<?> createPackingList(@RequestHeader("Authorization") String token,
                                                          @RequestParam Long tripId,
                                                          @RequestBody PackingListGenerationData generationData) {
        // Remove "Bearer " prefix if present
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        
        if (!tokenService.validateToken(actualToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            Long userId = tokenService.getUserIdFromToken(actualToken);
            
            // Validate that user exists
            if (!userRepository.existsById(userId)) {
                System.out.println("User with ID " + userId + " does not exist in database");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            
            // AI Abfrage
            GeneratePackigList generatePackingList = new GeneratePackigList(
                generationData.getZielohrt(),
                generationData.getGeschlecht(),
                generationData.getStartDatum() != null ? generationData.getStartDatum().toString() : null,
                generationData.getEndDatum() != null ? generationData.getEndDatum().toString() : null,
                generationData.getBesonderheiten()
            );
            
            List<PackingListItem> savedItems = new ArrayList<>();
            for (PackingListItem element : generatePackingList.getPackingListItems()) {
                element.setUserId(userId);
                element.setTripId(tripId);
                PackingListItem savedItem = packingListItemRepository.save(element);
                savedItems.add(savedItem);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating packing list: " + e.getMessage());
        }
    }

    @DeleteMapping("/")
    @Transactional
    public ResponseEntity<Void> deleteAll(@RequestHeader("Authorization") String token,
                                          @RequestParam Long tripId) {
        // Remove "Bearer " prefix if present
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        
        if (!tokenService.validateToken(actualToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(actualToken);
        
        // Validate that user exists
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            // Alternative: Items finden und einzeln löschen
            List<PackingListItem> itemsToDelete = packingListItemRepository.findByUserIdAndTripId(userId, tripId);
            packingListItemRepository.deleteAll(itemsToDelete);
            
            System.out.println("Successfully deleted " + itemsToDelete.size() + " packing list items");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error deleting packing list items: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@RequestHeader("Authorization") String token,
                                           @RequestParam Long tripId,
                                           @PathVariable Long id) {
        // Remove "Bearer " prefix if present
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        
        if (!tokenService.validateToken(actualToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(actualToken);
        
        // Validate that user exists
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Optional<PackingListItem> item = packingListItemRepository.findById(id);
        if (item.isPresent() && item.get().getUserId().equals(userId) && item.get().getTripId().equals(tripId)) {
            packingListItemRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/addItem")
    public ResponseEntity<PackingListItemData> addItem(@RequestHeader("Authorization") String token,
                                                             @RequestParam Long tripId,
                                                             @RequestBody PackingListItemData itemData) {
        // Remove "Bearer " prefix if present
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        
        if (!tokenService.validateToken(actualToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(actualToken);
        
        // Validate that user exists
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        PackingListItem item = new PackingListItem();
        item.setName(itemData.getName());
        item.setTickedOff(itemData.isTickedOff());
        item.setUserId(userId);
        item.setTripId(tripId);
        
        PackingListItem savedItem = packingListItemRepository.save(item);
        
        PackingListItemData responseData = new PackingListItemData();
        responseData.setId(savedItem.getId());
        responseData.setName(savedItem.getName());
        responseData.setTickedOff(savedItem.isTickedOff());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }

    @PutMapping("/editItem/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id,
                                                          @RequestHeader("Authorization") String token,
                                                          @RequestParam Long tripId,
                                                          @RequestBody PackingListItemData itemData) {
        // Remove "Bearer " prefix if present
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        
        if (!tokenService.validateToken(actualToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(actualToken);
        
        // Validate that user exists
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Optional<PackingListItem> item = packingListItemRepository.findById(id);
        if (item.isPresent() && item.get().getUserId().equals(userId) && item.get().getTripId().equals(tripId)) {
            PackingListItem existingItem = item.get();
            existingItem.setName(itemData.getName());
            existingItem.setTickedOff(itemData.isTickedOff());
            
            PackingListItem updatedItem = packingListItemRepository.save(existingItem);
            
            PackingListItemData responseData = new PackingListItemData();
            responseData.setId(updatedItem.getId());
            responseData.setName(updatedItem.getName());
            responseData.setTickedOff(updatedItem.isTickedOff());
            
            return ResponseEntity.ok(responseData);
        }
        return ResponseEntity.notFound().build();
    }
}