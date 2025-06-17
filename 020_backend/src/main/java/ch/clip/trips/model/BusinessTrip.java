package ch.clip.trips.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class BusinessTrip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String code;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    @OneToMany(mappedBy = "businessTrip")
    private List<Meeting> meetings;
} 