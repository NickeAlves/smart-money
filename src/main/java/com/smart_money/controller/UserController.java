package com.smart_money.controller;

import com.smart_money.dto.request.user.VerifyPasswordDTO;
import com.smart_money.dto.response.user.CurrentUserDTO;
import com.smart_money.dto.response.user.ResponseUserDTO;
import com.smart_money.dto.request.user.UpdateUserDTO;
import com.smart_money.model.User;
import com.smart_money.security.TokenService;
import com.smart_money.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.PosixFilePermission;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    private static final String UPLOAD_DIR = "uploads/profiles/";

    public UserController(UserService userService, TokenService tokenService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String userEmail = authentication.getName();
        Optional<User> optionalUser = userService.findUserByEmail(userEmail);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        User user = optionalUser.get();

        String dobString = null;
        if (user.getDateOfBirth() != null) {
            dobString = user.getDateOfBirth().format(DateTimeFormatter.ISO_LOCAL_DATE);
        }

        CurrentUserDTO userDTO = new CurrentUserDTO(
                user.getId(),
                user.getName(),
                user.getLastName(),
                user.getEmail(),
                dobString,
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
    public ResponseEntity<ResponseUserDTO<String>> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO updateUserDTO, HttpServletResponse response) {
        Optional<User> optionalUser = userService.findUserById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(new ResponseUserDTO<>(false, null, "User not found."));
        }

        User currentUser = optionalUser.get();

        if (updateUserDTO.email() != null && !updateUserDTO.email().equals(currentUser.getEmail())
                && userService.findUserByEmail(updateUserDTO.email()).isPresent()) {
            return ResponseEntity.status(400).body(new ResponseUserDTO<>(false, null, "Email already registered"));
        }

        String rawPassword = updateUserDTO.password();
        if (rawPassword != null && rawPassword.length() < 6) {
            return ResponseEntity.status(400).body(new ResponseUserDTO<>(false, null, "Password must be at least 6 characters long."));
        }

        String encodedPassword = rawPassword != null ? passwordEncoder.encode(rawPassword) : null;
        UpdateUserDTO updatedDTO = new UpdateUserDTO(
                updateUserDTO.name(),
                updateUserDTO.lastName(),
                updateUserDTO.email(),
                encodedPassword,
                updateUserDTO.dateOfBirth(),
                updateUserDTO.profileUrl()
        );

        Optional<User> updatedUserOpt = userService.updateUser(id, updatedDTO);
        if (updatedUserOpt.isEmpty()) {
            return ResponseEntity.status(500).body(new ResponseUserDTO<>(false, null, "Failed to update user."));
        }

        User updatedUser = updatedUserOpt.get();

        Cookie cookie = new Cookie("auth_token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        String token = tokenService.generateToken(updatedUser);

        cookie = new Cookie("auth_token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(86400); // 1 dia
        response.addCookie(cookie);

        return ResponseEntity.ok(new ResponseUserDTO<>(true, token, "User updated successfully. New token generated."));
    }

    @PutMapping("/{id}/upload-profile")
    public ResponseEntity<ResponseUserDTO<User>> uploadProfilePicture(
            @PathVariable Long id,
            @RequestParam("profileImage") MultipartFile file) {

        Optional<User> optionalUser = userService.findUserById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(new ResponseUserDTO(false, null, "User not found."));
        }

        if (file.isEmpty()) {
            return ResponseEntity.status(400).body(new ResponseUserDTO(false, null, "No file uploaded."));
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                setDirectoryPermissions(uploadPath);
            }

            String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String safeFilename = UUID.randomUUID() + "." + (fileExtension != null ? fileExtension : "jpg");
            Path filePath = uploadPath.resolve(safeFilename);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            setFilePermissions(filePath);

            String profileUrl = "/uploads/profiles/" + safeFilename;
            UpdateUserDTO updateUserDTO = new UpdateUserDTO(null, null, null, null, null, profileUrl);
            Optional<User> updatedUser = userService.updateUser(id, updateUserDTO);

            return updatedUser
                    .map(user -> ResponseEntity.ok(new ResponseUserDTO<>(
                            true,
                            user,
                            "Profile picture updated successfully.")))
                    .orElse(ResponseEntity.status(500).body(new ResponseUserDTO(
                            false,
                            null,
                            "Failed to update profile picture.")));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ResponseUserDTO(
                    false,
                    null,
                    "Error uploading file: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-password")
    public ResponseEntity<ResponseUserDTO> verifyPassword(@RequestBody VerifyPasswordDTO body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new ResponseUserDTO(false, null, "Unauthorized"));
        }

        String userEmail = authentication.getName();
        Optional<User> optionalUser = userService.findUserByEmail(userEmail);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(new ResponseUserDTO(false, null, "Email or password is incorrect"));
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(body.password(), user.getPassword())) {
            return ResponseEntity.status(401).body(new ResponseUserDTO(false, null, "Invalid password"));
        }

        return ResponseEntity.ok(new ResponseUserDTO(true, null, "Password verified successfully"));
    }

    private void setDirectoryPermissions(Path path) throws IOException {
        try {
            Set<PosixFilePermission> permissions = EnumSet.of(
                    PosixFilePermission.OWNER_READ,
                    PosixFilePermission.OWNER_WRITE,
                    PosixFilePermission.OWNER_EXECUTE,
                    PosixFilePermission.GROUP_READ,
                    PosixFilePermission.GROUP_EXECUTE,
                    PosixFilePermission.OTHERS_READ,
                    PosixFilePermission.OTHERS_EXECUTE
            );
            Files.setPosixFilePermissions(path, permissions);
        } catch (UnsupportedOperationException e) {
            System.out.println(e);
        }
    }

    private void setFilePermissions(Path path) throws IOException {
        try {
            Set<PosixFilePermission> permissions = EnumSet.of(
                    PosixFilePermission.OWNER_READ,
                    PosixFilePermission.OWNER_WRITE,
                    PosixFilePermission.GROUP_READ,
                    PosixFilePermission.OTHERS_READ
            );
            Files.setPosixFilePermissions(path, permissions);
        } catch (UnsupportedOperationException e) {
            System.out.println(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseUserDTO> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.ok(new ResponseUserDTO(true, null, "User deleted successfully."));
        }
        return ResponseEntity.status(404).body(new ResponseUserDTO(false, null, "User not found."));
    }
}