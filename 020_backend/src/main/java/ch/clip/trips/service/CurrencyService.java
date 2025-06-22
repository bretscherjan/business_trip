package ch.clip.trips.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class CurrencyService {
    private static final Logger logger = LoggerFactory.getLogger(CurrencyService.class);
    
    @Value("${currencyapi.api.url}")
    private String apiUrl;

    @Value("${currencyapi.api.key}")
    private String apiKey;

    public double convert(double amount, String from, String to) {
        logger.info("Starting currency conversion: {} {} to {}", amount, from, to);
        RestTemplate restTemplate = new RestTemplate();
        
        // CurrencyAPI.com URL-Struktur
        String latestUrl = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .path("/latest")
                .queryParam("apikey", apiKey)
                .queryParam("base_currency", from)
                .queryParam("currencies", to)
                .toUriString();
        
        logger.info("API URL: {}", latestUrl);
        logger.info("API Key: {}", apiKey.substring(0, Math.min(10, apiKey.length())) + "...");
        
        try {
            logger.info("Making API request to: {}", latestUrl);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                latestUrl, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            logger.info("API response status: {}", response.getStatusCode());
            Map<String, Object> latestResponse = response.getBody();
            logger.info("Währungs-API-Response: {}", latestResponse);

            if (latestResponse == null) {
                logger.error("No response body received from API");
                throw new RuntimeException("Keine Antwort von der Währungs-API erhalten");
            }

            // Prüfe auf API-Fehler
            if (latestResponse.containsKey("errors")) {
                Object errors = latestResponse.get("errors");
                logger.error("API returned errors: {}", errors);
                throw new RuntimeException("API-Fehler: " + errors);
            }

            // Zusätzliche Ausgabe für Debugging
            if (!latestResponse.containsKey("data")) {
                logger.error("API-Response enthält kein 'data'-Feld: {}", latestResponse);
                throw new RuntimeException("API-Response enthält kein 'data'-Feld: " + latestResponse);
            }

            Object dataObj = latestResponse.get("data");
            if (!(dataObj instanceof Map)) {
                logger.error("'data' ist kein Map: {}", dataObj);
                throw new RuntimeException("'data' ist kein Map: " + dataObj);
            }
            Map<String, Object> data = (Map<String, Object>) dataObj;
            if (!data.containsKey(to)) {
                logger.error("Zielwährung '{}' nicht in API-Response enthalten. Verfügbare: {}", to, data.keySet());
                throw new RuntimeException("Zielwährung '" + to + "' nicht in API-Response enthalten. Verfügbare: " + data.keySet());
            }
            Object currencyObj = data.get(to);
            if (!(currencyObj instanceof Map)) {
                logger.error("currencyData ist kein Map: {}", currencyObj);
                throw new RuntimeException("currencyData ist kein Map: " + currencyObj);
            }
            Map<String, Object> currencyData = (Map<String, Object>) currencyObj;
            Object valueObj = currencyData.get("value");
            if (!(valueObj instanceof Number)) {
                logger.error("'value' ist kein Zahlenwert: {}", valueObj);
                throw new RuntimeException("'value' ist kein Zahlenwert: " + valueObj);
            }
            double rate = ((Number) valueObj).doubleValue();
            logger.info("Wechselkurs gefunden: 1 {} = {} {}", from, rate, to);
            double result = amount * rate;
            logger.info("Conversion result: {} {} = {} {}", amount, from, result, to);
            return result;

        } catch (Exception e) {
            logger.error("Fehler bei der Währungsumrechnung: {}", e.getMessage(), e);
            String errorMessage = "API-Fehler: " + e.getMessage();
            if (e.getCause() != null) {
                errorMessage += " - Ursache: " + e.getCause().getMessage();
            }
            throw new RuntimeException(errorMessage, e);
        }
    }
} 