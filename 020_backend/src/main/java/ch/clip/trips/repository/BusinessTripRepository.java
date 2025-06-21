package ch.clip.trips.repository;

import ch.clip.trips.model.BusinessTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BusinessTripRepository extends JpaRepository<BusinessTrip, Long> {
    @Query(value = "SELECT bt.* FROM business_trip bt JOIN user_business_trip ubt ON bt.id = ubt.trip_id WHERE ubt.user_id = :userId", nativeQuery = true)
    List<BusinessTrip> findAllByUser(@Param("userId") Long userId);
}