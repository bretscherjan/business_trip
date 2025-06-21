package ch.clip.trips.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class CurrencyService {
    private static final Logger logger = LoggerFactory.getLogger(CurrencyService.class);
    
    @Value("${currencyapi.api.url}")
    private String apiUrl;

    @Value("${currencyapi.api.key}")
    private String apiKey;

    public double convert(double amount, String from, String to) {
        RestTemplate restTemplate = new RestTemplate();
        
        // API-Anfrage, um den aktuellsten Wechselkurs zu erhalten
        String latestUrl = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .path("/latest")
                .queryParam("apikey", apiKey)
                .queryParam("base_currency", from)
                .queryParam("currencies", to)
                .toUriString();
        
        try {
            logger.info("Währungs-API-Request (latest): {}", latestUrl);
            java.util.Map<String, Object> latestResponse = restTemplate.exchange(
                latestUrl, HttpMethod.GET, null, new ParameterizedTypeReference<java.util.Map<String, Object>>() {}
            ).getBody();
            logger.info("Währungs-API-Response (latest): {}", latestResponse);

            if (latestResponse != null && latestResponse.containsKey("data")) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) latestResponse.get("data");
                if (data.containsKey(to)) {
                    @SuppressWarnings("unchecked")
                    java.util.Map<String, Object> currencyData = (java.util.Map<String, Object>) data.get(to);
                    if (currencyData.containsKey("value")) {
                        double rate = ((Number) currencyData.get("value")).doubleValue();
                        return amount * rate;
                    }
                }
            }
            
            throw new RuntimeException("Währungsumrechnung fehlgeschlagen: Kurs für '" + to + "' nicht in der API-Antwort gefunden. Response: " + latestResponse);

        } catch (Exception e) {
            throw new RuntimeException("Fehler bei der Währungsumrechnung: " + e.getMessage(), e);
        }
    }
} 