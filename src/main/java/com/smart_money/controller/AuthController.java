package com.smart_money.controller;

import com.smart_money.dto.reponse.ResponseDTO;
import com.smart_money.dto.request.LoginUserDTO;
import com.smart_money.dto.request.RegisterUserDTO;
import com.smart_money.model.User;
import com.smart_money.repository.UserRepository;
import com.smart_money.security.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

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
    public ResponseEntity<ResponseDTO> register(@Valid @RequestBody RegisterUserDTO body) {
        if (userRepository.findUserByEmail(body.email()).isPresent()) {
            return ResponseEntity.status(400).body(new ResponseDTO(false, null, "Email already registered."));
        }

        User newUser = new User();
        newUser.setName(body.name());
        newUser.setLastName(body.lastName());
        newUser.setEmail(body.email());
        newUser.setPassword(passwordEncoder.encode(body.password()));
        newUser.setAge(body.age());

        userRepository.save(newUser);

        String token = tokenService.generateToken(newUser);

        return ResponseEntity.ok(new ResponseDTO(true, token, "Registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login (@Valid @RequestBody LoginUserDTO body, HttpServletResponse response) {
        Optional<User> optionalUser = userRepository.findUserByEmail(body.email());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(new ResponseDTO(false, null, "User not found"));
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(body.password(), user.getPassword())) {
            return ResponseEntity.status(401).body(new ResponseDTO(false, null, "Email or password incorrect"));
        }

        String token = tokenService.generateToken(user);

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(3600);

        response.addCookie(cookie);
        response.setHeader("Set-Cookie", "token=" + token + "; HttpOnly; Secure; Path=/; Max-Age=3600; SameSite=Strict");

        return ResponseEntity.ok(new ResponseDTO(true, token, "Login successfully!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseDTO> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(new ResponseDTO(true, null, "Logged out successfully."));
    }
}
