package com.smart_money.service;

import com.smart_money.dto.request.user.UpdateUserDTO;
import com.smart_money.model.User;
import com.smart_money.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateUser(Long id, UpdateUserDTO updateUserDTO) {
        return userRepository.findById(id).map(existingUser -> {
            if (updateUserDTO.name() != null) existingUser.setName(capitalizeFirstLetters(updateUserDTO.name()));
            if (updateUserDTO.lastName() != null) existingUser.setLastName(capitalizeFirstLetters(updateUserDTO.lastName()));
            if (updateUserDTO.email() != null) existingUser.setEmail(updateUserDTO.email());
            if (updateUserDTO.password() != null) existingUser.setPassword(updateUserDTO.password());
            if (updateUserDTO.profileUrl() != null) existingUser.setProfileUrl(updateUserDTO.profileUrl());

            if (updateUserDTO.name() != null && !updateUserDTO.name().isBlank()) {
                existingUser.setName(updateUserDTO.name());
            }

            if (updateUserDTO.dateOfBirth() != null) {
                try {
                    LocalDate dob = LocalDate.parse(updateUserDTO.dateOfBirth(), DateTimeFormatter.ISO_LOCAL_DATE);
                    existingUser.setDateOfBirth(dob);
                } catch (Exception e) {
                    System.err.println("Error while parsing date of birth: " + e.getMessage());
                }
            }
            return userRepository.save(existingUser);
        });
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public static String capitalizeFirstLetters(String input) {
        if (input == null || input.isEmpty()) return input;

        String[] words = input.trim().split("\\s+");
        StringBuilder result= new StringBuilder();

        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)));
                if (word.length() > 1) {
                    result.append(word.substring(1).toLowerCase());
                }
                result.append(" ");
            }
        }

        return result.toString().trim();
    }
}
