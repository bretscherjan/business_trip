package ch.clip.trips.service;

import ch.clip.trips.service.UserService;
import ch.clip.trips.data.User;
import ch.clip.trips.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPasswordHash())) {
            String token = tokenService.generateToken(user);
            user.setToken(token);
            return userRepository.save(user);
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

    public User register(String username, String password, String email, String phoneNumber, User.Role role) {
        if (userRepository.findByUsername(username) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setRole(role);
        user = userRepository.save(user);
        String token = tokenService.generateToken(user);
        user.setToken(token);
        return userRepository.save(user);
    }
}