package ch.clip.trips.service;

import ch.clip.trips.data.PackingListItem;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.http.*;
import java.net.URI;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.ArrayList;
import java.util.List;

public class GeneratePackigList {

    private List<PackingListItem> packingListItems;

    public GeneratePackigList(String ort, String geschlecht, String startdatum, String enddatum, String prompt){
        // API-Key
        String apiKey = "3a3c652638364fd2a3d7ff3f19ffe97c";

        // JSON-Body
        String jsonBody = String.format("""
{
  "model": "google/gemma-3n-e4b-it",
  "messages": [
                    {
                      "role": "user",
                      "content": "Du bist eine hilfreiche KI, die Packlisten für Reisen erstellt. Bitte generiere eine einfache Liste von Strings – keine Erklärungen, keine Formatierung.\\\\n\\\\nHier sind die Reisedaten im JSON-Format:\\\\n{\\\\\\"ort\\\\\\": \\\\\\"%s\\\\\\", \\\\\\"geschlecht\\\\\\": \\\\\\"%s\\\\\\", \\\\\\"Startdatum\\\\\\": \\\\\\"%s\\\\\\", \\\\\\"Enddatum\\\\\\": \\\\\\"%s\\\\\\", \\\\\\"Prompt\\\\\\": \\\\\\"%s\\\\\\"}"
                    }
  ],
  "max_tokens": 512,
  "stream": false
}
""", ort, geschlecht, startdatum, enddatum, prompt);

        // HTTP-Request
        HttpRequest request = null;
        try {
            request = HttpRequest.newBuilder()
                    .uri(new URI("https://api.aimlapi.com/chat/completions"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(BodyPublishers.ofString(jsonBody))
                    .build();
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }

        // HTTP-Client & -Response
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = null;
        try {
            response = client.send(request, BodyHandlers.ofString());
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }

        parseResponse(response.body());
    }

    private void parseResponse(String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            // Get the content from the response
            String content = rootNode.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            // Split the content by newlines and create PackingListItem objects
            packingListItems = new ArrayList<>();
            String[] items = content.split("\n");

            for (String item : items) {
                if (!item.trim().isEmpty()) {
                    PackingListItem packingItem = new PackingListItem();
                    packingItem.setName(item.trim());
                    packingItem.setTickedOff(false);
                    packingListItems.add(packingItem);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Error parsing API response", e);
        }
    }

    public List<PackingListItem> getPackingListItems() {
        return packingListItems;
    }
}