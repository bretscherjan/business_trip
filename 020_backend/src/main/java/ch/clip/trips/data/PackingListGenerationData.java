package ch.clip.trips.data;

import lombok.Data;

@Data
public class PackingListGenerationData {
    private String startDatum;
    private String endDatum;
    private String geschlecht;
    private String zielohrt;
    private String besonderheiten;
}