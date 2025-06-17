package ch.clip.trips.repository;

import ch.clip.trips.data.PackingListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackingListItemRepository extends JpaRepository<PackingListItem, Long> {
    List<PackingListItem> findByUserIdAndTripId(Long userId, Long tripId);
    void deleteByUserIdAndTripId(Long userId, Long tripId);
} 