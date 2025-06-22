package ch.clip.trips.repository;

import ch.clip.trips.model.BusinessTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessTripRepository extends JpaRepository<BusinessTrip, Long> {
    List<BusinessTrip> findByCodeContainingIgnoreCase(String code);
    List<BusinessTrip> findByDescriptionContainingIgnoreCase(String description);
}