package ch.clip.trips.service;

import ch.clip.trips.data.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TokenService {

    private static final String SECRET_KEY = "eyJhbGciOiJIUzUxMiJ9eew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbmlzaCBOYXRoIiwNCiAgImlhdCI6IDE1MTYyMzkwMjINCn0f9WekREqO7aIGR3hWU5uc0BaJsKEOPqc2ZVAY1ABP65OZEiD74H7wViLi4Bhv2hMotRgCEL47bZgRV5N9KyhxPw";
    private static final long EXPIRATION_TIME = 86400000; // 1 Tag in Millisekunden

    public String generateToken(User user) {
        System.out.println("Generating token for user: " + user.getUsername() + " with ID: " + user.getId());
        String token = Jwts.builder()
                .setSubject(user.getUsername())
                .claim("userId", user.getId())
                .claim("userRole", user.getRole().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
        System.out.println("Generated token: " + token);
        return token;
    }

    public boolean validateToken(String token) {
        try {
            System.out.println("Validating token: " + token);
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            System.out.println("Token validation successful");
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        try {
            Long userId = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .get("userId", Long.class);
            System.out.println("Extracted user ID from token: " + userId);
            return userId;
        } catch (Exception e) {
            System.out.println("Error extracting user ID from token: " + e.getMessage());
            throw e;
        }
    }

    public String getUserRoleFromToken(String token) {
        try {
            String userRole = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .get("userRole", String.class);
            System.out.println("Extracted user role from token: " + userRole);
            return userRole;
        } catch (Exception e) {
            System.out.println("Error extracting user role from token: " + e.getMessage());
            throw e;
        }
    }
}