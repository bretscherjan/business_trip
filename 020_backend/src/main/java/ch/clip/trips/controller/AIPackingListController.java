package ch.clip.trips.controller;

import ch.clip.trips.data.PackingListGenerationData;
import ch.clip.trips.data.PackingListItem;
import ch.clip.trips.data.PackingListItemData;
import ch.clip.trips.repository.PackingListItemRepository;
import ch.clip.trips.service.GeneratePackigList;
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

    @GetMapping("")
    public ResponseEntity<List<PackingListItemData>> getPackingList(@RequestParam Long idPerson,
                                                       @RequestParam Long idTrip) {
        List<PackingListItem> items = packingListItemRepository.findByPersonIdAndTripId(idPerson, idTrip);
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
    public ResponseEntity<List<PackingListItem>> createPackingList(@RequestParam Long idPerson,
                                                          @RequestParam Long idTrip,
                                                          @RequestBody PackingListGenerationData generationData) {
        // AI Abfrage
        GeneratePackigList generatePackigList = new GeneratePackigList(generationData.getZielohrt(), generationData.getGeschlecht(), generationData.getStartDatum(), generationData.getEndDatum(), generationData.getBesonderheiten());
        
        List<PackingListItem> savedItems = new ArrayList<>();
        for (PackingListItem element : generatePackigList.getPackingListItems()) {
            element.setPersonId(idPerson);
            element.setTripId(idTrip);
            PackingListItem savedItem = packingListItemRepository.save(element);
            savedItems.add(savedItem);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedItems);
    }

    @DeleteMapping("/")
    public ResponseEntity<Void> deleteAll(@RequestParam Long idPerson,
                                          @RequestParam Long idTrip) {
        packingListItemRepository.deleteByPersonIdAndTripId(idPerson, idTrip);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@RequestParam Long idPerson,
                                           @RequestParam Long idTrip,
                                           @PathVariable Long id) {
        Optional<PackingListItem> item = packingListItemRepository.findById(id);
        if (item.isPresent() && item.get().getPersonId().equals(idPerson) && item.get().getTripId().equals(idTrip)) {
            packingListItemRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/addItem")
    public ResponseEntity<PackingListItemData> addItem(@RequestParam Long idPerson,
                                                             @RequestParam Long idTrip,
                                                             @RequestBody PackingListItemData itemData) {
        PackingListItem item = new PackingListItem();
        item.setName(itemData.getName());
        item.setTickedOff(itemData.isTickedOff());
        item.setPersonId(idPerson);
        item.setTripId(idTrip);
        
        PackingListItem savedItem = packingListItemRepository.save(item);
        
        PackingListItemData responseData = new PackingListItemData();
        responseData.setName(savedItem.getName());
        responseData.setTickedOff(savedItem.isTickedOff());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }

    @PutMapping("/editItem/{id}")
    public ResponseEntity<PackingListItemData> updatePost(@PathVariable Long id,
                                                          @RequestParam Long idPerson,
                                                          @RequestParam Long idTrip,
                                                          @RequestBody PackingListItemData itemData) {
        Optional<PackingListItem> item = packingListItemRepository.findById(id);
        if (item.isPresent() && item.get().getPersonId().equals(idPerson) && item.get().getTripId().equals(idTrip)) {
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
