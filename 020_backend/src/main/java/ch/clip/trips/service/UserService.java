package ch.clip.trips.service;

import ch.clip.trips.data.User;
import ch.clip.trips.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && verifyPassword(password, user.getPasswordHash())) {
            // Generate new token
            String token = generateToken();
            user.setToken(token);
            userRepository.save(user);
            return user;
        }
        return null;
    }

    public void logout(String token) {
        User user = userRepository.findByToken(token);
        if (user != null) {
            user.setToken(null);
            userRepository.save(user);
        }
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }

    private boolean verifyPassword(String inputPassword, String storedHash) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(inputPassword.getBytes(StandardCharsets.UTF_8));
            String inputHash = Base64.getEncoder().encodeToString(hash);
            return inputHash.equals(storedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error verifying password", e);
        }
    }
} 