package ch.clip.trips.service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.http.*;
import java.net.URI;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;

public class GeneratePackigList {

    private String aiResponse;

    public GeneratePackigList(String ort, String geschlecht, String startdatum, String enddatum, String prompt){
        System.out.println("Test2");
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
        System.out.println("Test3");

        // HTTP-Client & -Response
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = null;
        try {
            response = client.send(request, BodyHandlers.ofString());
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        System.out.println("Test4");

        // Status prüfen und ausgeben
        if (response.statusCode() != 200) {
            //throw new RuntimeException("Fehler: " + response.statusCode());
        }

        aiResponse = response.body();
        System.out.println(response.body());
        System.out.println("Test5");
    }

    public String getAiResponse() {
        return aiResponse;
    }
}