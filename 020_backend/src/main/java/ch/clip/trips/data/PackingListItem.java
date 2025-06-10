package ch.clip.trips.data;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "packing_list_item")
public class PackingListItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean tickedOff;

    @Column(name = "person_id", nullable = false)
    private Long personId;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;
} 