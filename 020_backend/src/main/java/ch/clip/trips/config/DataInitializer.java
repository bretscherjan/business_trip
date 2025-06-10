package ch.clip.trips.config;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import ch.clip.trips.model.BusinessTrip;
import ch.clip.trips.model.Meeting;
import ch.clip.trips.repo.BusinessTripRepository;
import ch.clip.trips.repo.MeetingRepository;

@Configuration
public class DataInitializer {
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    @Transactional
    public CommandLineRunner demoData(BusinessTripRepository businessTripRepository, MeetingRepository meetingRepository) {
        return (args) -> {
            try {
                log.info("Initializing demo data...");
                
                // Create and save business trips
                BusinessTrip bt01 = new BusinessTrip(1L, "BT01", "San Francisco World Trade Center on new Server/IOT/Client", 
                    LocalDateTime.of(2021, 2, 13, 9, 00), LocalDateTime.of(2021, 2, 15, 16, 56));
                BusinessTrip bt02 = new BusinessTrip(2L, "BT02", "Santa Clara Halley on new Server/IOT/Client", 
                    LocalDateTime.of(2021, 6, 23, 9, 00), LocalDateTime.of(2021, 6, 27, 16, 56));
                BusinessTrip bt03 = new BusinessTrip(3L, "BT03", "San Cose City Halley on Docker/IOT/Client", 
                    LocalDateTime.of(2021, 12, 13, 9, 00), LocalDateTime.of(2021, 12, 15, 16, 56));

                businessTripRepository.saveAll(List.of(bt01, bt02, bt03));
                log.info("Saved {} business trips", businessTripRepository.count());

                // Create and save meetings
                List<Meeting> meetings = List.of(
                    new Meeting(1L, "One Conference", "Key Note on One Conference", bt01),
                    new Meeting(2L, "Zero Conference", "Workshop Zero on One Conference", bt01),
                    new Meeting(3L, "One Conference", "HandsOn on One Conference", bt02),
                    new Meeting(4L, "One Conference", "Key Note on One Conference", bt02),
                    new Meeting(5L, "One Conference", "Key Note on One Conference", bt03)
                );

                meetingRepository.saveAll(meetings);
                log.info("Saved {} meetings", meetingRepository.count());

            } catch (Exception e) {
                log.error("Error initializing demo data: {}", e.getMessage(), e);
            }
        };
    }
} 