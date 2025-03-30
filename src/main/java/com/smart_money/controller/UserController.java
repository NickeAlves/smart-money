package com.smart_money.controller;

import com.smart_money.dto.reponse.CurrentUserDTO;
import com.smart_money.dto.reponse.ResponseDTO;
import com.smart_money.dto.request.UpdateUserDTO;
import com.smart_money.model.User;
import com.smart_money.security.TokenService;
import com.smart_money.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final TokenService tokenService;

    public UserController(UserService userService, TokenService tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserDTO> getCurrentUser(HttpServletRequest request) {
        String token = Arrays.stream(request.getCookies())
                .filter(cookie -> "token".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (token == null) {
            return ResponseEntity.status(401).build();
        }

        String userEmail;
        try {
            userEmail = tokenService.validateToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }

        if (userEmail == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<User> optionalUser = userService.findUserByEmail(userEmail);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        User user = optionalUser.get();
        CurrentUserDTO userDTO = new CurrentUserDTO(
                user.getName(),
                user.getLastName(),
                user.getEmail(),
                user.getAge(),
                user.getProfileUrl()
        );

        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO<User>> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO updateUserDTO) {
        Optional<User> optionalUser = userService.findUserById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(new ResponseDTO(false, null, "User not found."));
        }

        Optional<User> updatedUser = userService.updateUser(id, updateUserDTO);

        return updatedUser
                .map(user -> ResponseEntity.ok(new ResponseDTO<>(true, user, "User update successfully.")))
                .orElse(ResponseEntity.status(500).body(new ResponseDTO(false, null, "Failed to update user.")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(404).build();
    }

}
