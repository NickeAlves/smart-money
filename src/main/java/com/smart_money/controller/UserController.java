package com.smart_money.controller;

import com.smart_money.dto.reponse.ResponseDTO;
import com.smart_money.dto.request.UpdateUserDTO;
import com.smart_money.model.User;
import com.smart_money.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers();
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
