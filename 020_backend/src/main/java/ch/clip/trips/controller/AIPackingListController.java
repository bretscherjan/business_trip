package ch.clip.trips.controller;

import ch.clip.trips.data.PackingListGenerationData;
import ch.clip.trips.data.PackingListItem;
import ch.clip.trips.data.PackingListItemData;
import ch.clip.trips.repository.PackingListItemRepository;
import ch.clip.trips.service.GeneratePackigList;
import ch.clip.trips.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private TokenService tokenService;

    @GetMapping("")
    public ResponseEntity<List<PackingListItemData>> getPackingList(@RequestHeader("Authorization") String token,
                                                       @RequestParam Long tripId) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(token);
        List<PackingListItem> items = packingListItemRepository.findByUserIdAndTripId(userId, tripId);
        if (items.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<PackingListItemData> responseItems = items.stream()
            .map(item -> {
                PackingListItemData data = new PackingListItemData();
                data.setName(item.getName());
                data.setTickedOff(item.isTickedOff());
                return data;
            })
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(responseItems);
    }

    @PostMapping("/Generate")
    public ResponseEntity<List<PackingListItem>> createPackingList(@RequestHeader("Authorization") String token,
                                                          @RequestParam Long tripId,
                                                          @RequestBody PackingListGenerationData generationData) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(token);
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
    }

    @DeleteMapping("/")
    public ResponseEntity<Void> deleteAll(@RequestHeader("Authorization") String token,
                                          @RequestParam Long tripId) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(token);
        packingListItemRepository.deleteByUserIdAndTripId(userId, tripId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@RequestHeader("Authorization") String token,
                                           @RequestParam Long tripId,
                                           @PathVariable Long id) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(token);
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
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(token);
        PackingListItem item = new PackingListItem();
        item.setName(itemData.getName());
        item.setTickedOff(itemData.isTickedOff());
        item.setUserId(userId);
        item.setTripId(tripId);
        
        PackingListItem savedItem = packingListItemRepository.save(item);
        
        PackingListItemData responseData = new PackingListItemData();
        responseData.setName(savedItem.getName());
        responseData.setTickedOff(savedItem.isTickedOff());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }

    @PutMapping("/editItem/{id}")
    public ResponseEntity<PackingListItemData> updatePost(@PathVariable Long id,
                                                          @RequestHeader("Authorization") String token,
                                                          @RequestParam Long tripId,
                                                          @RequestBody PackingListItemData itemData) {
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Long userId = tokenService.getUserIdFromToken(token);
        Optional<PackingListItem> item = packingListItemRepository.findById(id);
        if (item.isPresent() && item.get().getUserId().equals(userId) && item.get().getTripId().equals(tripId)) {
            PackingListItem existingItem = item.get();
            existingItem.setName(itemData.getName());
            existingItem.setTickedOff(itemData.isTickedOff());
            
            PackingListItem updatedItem = packingListItemRepository.save(existingItem);
            
            PackingListItemData responseData = new PackingListItemData();
            responseData.setName(updatedItem.getName());
            responseData.setTickedOff(updatedItem.isTickedOff());
            
            return ResponseEntity.ok(responseData);
        }
        return ResponseEntity.notFound().build();
    }
}