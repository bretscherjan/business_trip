package ch.clip.trips.service;

import ch.clip.trips.data.User;
import ch.clip.trips.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);

        if (user != null && verifyPassword(password, user.getPasswordHash())) {
            String token = generateToken();
            user.setToken(token);
            userRepository.save(user);
            return user;
        }

        return null;
    }

    public User register(String username, String email, String password, String firstName, String lastName) {
        // Prüfe ob Benutzer bereits existiert
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Benutzername bereits vergeben");
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email bereits vergeben");
        }

        // Erstelle neuen Benutzer
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(hashPassword(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(User.UserRole.MITARBEITER); // Standardrolle

        return userRepository.save(user);
    }

    public void logout(String token) {
        User user = userRepository.findByToken(token);
        if (user != null) {
            user.setToken(null);
            userRepository.save(user);
        }
    }

    public User getUserByToken(String token) {
        return userRepository.findByToken(token);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }

    public User updateUserRole(Long userId, User.UserRole newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Benutzer nicht gefunden"));
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public boolean hasRole(User user, User.UserRole role) {
        return user != null && user.getRole() == role;
    }

    public boolean isAdmin(User user) {
        return hasRole(user, User.UserRole.ADMIN);
    }

    public boolean isManager(User user) {
        return hasRole(user, User.UserRole.MANAGER) || isAdmin(user);
    }

    public String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-512");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-512 algorithm not available", e);
        }
    }

    private boolean verifyPassword(String inputPassword, String storedHash) {
        String inputHash = hashPassword(inputPassword);
        return inputHash.equals(storedHash);
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }
}