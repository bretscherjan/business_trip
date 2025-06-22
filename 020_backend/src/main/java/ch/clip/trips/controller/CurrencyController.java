package ch.clip.trips.controller;

import ch.clip.trips.service.CurrencyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/currency")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}, allowCredentials = "true")
public class CurrencyController {

    private static final Logger logger = LoggerFactory.getLogger(CurrencyController.class);

    @Autowired
    private CurrencyService currencyService;

    @PostMapping("/convert")
    public ResponseEntity<Map<String, Object>> convertCurrency(
            @RequestBody Map<String, Object> request) {
        
        try {
            logger.info("Currency conversion request received: {}", request);

            String fromCurrency = (String) request.get("fromCurrency");
            String toCurrency = (String) request.get("toCurrency");
            Object amountObj = request.get("amount");
            
            logger.info("Request parameters - fromCurrency: {}, toCurrency: {}, amount: {}", fromCurrency, toCurrency, amountObj);

            if (fromCurrency == null || toCurrency == null || amountObj == null) {
                logger.warn("Missing required parameters");
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Alle Felder (fromCurrency, toCurrency, amount) sind erforderlich"
                ));
            }

            Double amount;
            try {
                amount = Double.parseDouble(amountObj.toString());
            } catch (NumberFormatException e) {
                logger.warn("Invalid amount format: {}", amountObj);
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Ungültiges Betragsformat: " + amountObj
                ));
            }

            logger.info("Calling currency service with amount: {}, from: {}, to: {}", amount, fromCurrency, toCurrency);
            Double convertedAmount = currencyService.convert(amount, fromCurrency, toCurrency);
            
            logger.info("Conversion successful: {} {} = {} {}", amount, fromCurrency, convertedAmount, toCurrency);
            
            return ResponseEntity.ok(Map.of(
                "fromCurrency", fromCurrency,
                "toCurrency", toCurrency,
                "originalAmount", amount,
                "convertedAmount", convertedAmount
            ));
        } catch (Exception e) {
            logger.error("Fehler im CurrencyController: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Fehler bei der Währungsumrechnung: " + e.getMessage()
            ));
        }
    }

    @RequestMapping(value = "/convert", method = {RequestMethod.OPTIONS})
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.ok().build();
    }
} 