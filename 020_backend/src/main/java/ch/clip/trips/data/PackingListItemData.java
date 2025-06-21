package ch.clip.trips.data;

import lombok.Data;

@Data
public class PackingListItemData {
    private String name;
    private boolean tickedOff;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isTickedOff() { return tickedOff; }
    public void setTickedOff(boolean tickedOff) { this.tickedOff = tickedOff; }
}
