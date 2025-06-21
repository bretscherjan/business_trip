package ch.clip.trips.data;

// import lombok.Data;
import java.time.LocalDate;

// @Data
public class PackingListGenerationData {
    private String zielohrt;
    private String geschlecht;
    private LocalDate startDatum;
    private LocalDate endDatum;
    private String besonderheiten;

    public String getGeschlecht() { return geschlecht; }
    public void setGeschlecht(String geschlecht) { this.geschlecht = geschlecht; }
    public LocalDate getStartDatum() { return startDatum; }
    public void setStartDatum(LocalDate startDatum) { this.startDatum = startDatum; }
    public LocalDate getEndDatum() { return endDatum; }
    public void setEndDatum(LocalDate endDatum) { this.endDatum = endDatum; }
    public String getBesonderheiten() { return besonderheiten; }
    public void setBesonderheiten(String besonderheiten) { this.besonderheiten = besonderheiten; }
    public String getZielohrt() { return zielohrt; }
    public void setZielohrt(String zielohrt) { this.zielohrt = zielohrt; }
}