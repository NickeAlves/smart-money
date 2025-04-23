package com.smart_money.controller;

import com.smart_money.dto.response.user.ResponseUserDTO;
import com.smart_money.dto.request.user.LoginUserDTO;
import com.smart_money.dto.request.user.RegisterUserDTO;
import com.smart_money.model.User;
import com.smart_money.repository.UserRepository;
import com.smart_money.security.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import static com.smart_money.service.UserService.capitalizeFirstLetters;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseUserDTO> register(@Valid @RequestBody RegisterUserDTO body, HttpServletResponse response) {
        if (userRepository.findUserByEmail(body.email()).isPresent()) {
            return ResponseEntity.status(400).body(new ResponseUserDTO(false, null, "Email already registered"));
        }

        if (body.password().length() < 6) {
            return ResponseEntity.status(400).body(new ResponseUserDTO(false, null, "Password must be a minimum of 6 characters"));
        }
        User newUser = new User();
        newUser.setName(capitalizeFirstLetters(body.name()));
        newUser.setLastName(capitalizeFirstLetters(body.lastName()));
        newUser.setEmail(body.email());
        newUser.setPassword(passwordEncoder.encode(body.password()));

        if (body.dateOfBirth() != null && !body.dateOfBirth().isEmpty()) {
            try {
                LocalDate dob = LocalDate.parse(body.dateOfBirth(), DateTimeFormatter.ISO_LOCAL_DATE);
                newUser.setDateOfBirth(dob);
            } catch (Exception e) {
                return ResponseEntity.status(400).body(new ResponseUserDTO<>(false, null, "Invalid date of birth format. Use YYYY-MM-DD"));
            }
        } else {
            newUser.setDateOfBirth(null);
        }

        userRepository.save(newUser);

        String token = tokenService.generateToken(newUser);

        Cookie cookie = new Cookie("auth_token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(86400);
        response.addCookie(cookie);

        return ResponseEntity.ok(new ResponseUserDTO(true, token, "Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseUserDTO> login(@Valid @RequestBody LoginUserDTO body, HttpServletResponse response) {
        Optional<User> optionalUser = userRepository.findUserByEmail(body.email());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(new ResponseUserDTO(false, null, "Email or password is incorrect"));
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(body.password(), user.getPassword())) {
            return ResponseEntity.status(401).body(new ResponseUserDTO(false, null, "Email or password is incorrect"));
        }

        String token = tokenService.generateToken(user);

        Cookie cookie = new Cookie("auth_token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(86400);
        response.addCookie(cookie);

        return ResponseEntity.ok(new ResponseUserDTO(true, token, "Logged in successfully"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseUserDTO> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("auth_token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(new ResponseUserDTO(true, null, "Logged out successfully"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ResponseUserDTO> refreshToken(@RequestHeader("Authorization") String authHeader, HttpServletResponse response) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ResponseUserDTO(false, null, "Invalid authorization header"));
        }

        String token = authHeader.substring(7);
        String email = tokenService.validateToken(token);

        if (email == null) {
            return ResponseEntity.status(401).body(new ResponseUserDTO(false, null, "Invalid or expired token"));
        }

        Optional<User> optionalUser = userRepository.findUserByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(new ResponseUserDTO(false, null, "User not found"));
        }

        User user = optionalUser.get();
        String newToken = tokenService.generateToken(user);

        Cookie cookie = new Cookie("auth_token", newToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(86400);
        response.addCookie(cookie);

        return ResponseEntity.ok(new ResponseUserDTO(true, newToken, "Token refreshed successfully"));
    }
}