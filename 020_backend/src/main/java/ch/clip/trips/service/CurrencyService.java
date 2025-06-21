package ch.clip.trips.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class CurrencyService {
    private static final String API_URL = "https://api.exchangerate.host/convert";

    public double convert(double amount, String from, String to) {
        RestTemplate restTemplate = new RestTemplate();
        String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                .queryParam("from", from)
                .queryParam("to", to)
                .queryParam("amount", amount)
                .toUriString();
        try {
            var response = restTemplate.getForObject(url, java.util.Map.class);
            if (response != null && response.containsKey("result")) {
                return ((Number) response.get("result")).doubleValue();
            }
        } catch (Exception e) {
            throw new RuntimeException("Währungsumrechnung fehlgeschlagen: " + e.getMessage());
        }
        throw new RuntimeException("Währungsumrechnung fehlgeschlagen");
    }
} 