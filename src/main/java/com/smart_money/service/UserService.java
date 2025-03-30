package com.smart_money.service;

import com.smart_money.dto.request.UpdateUserDTO;
import com.smart_money.model.User;
import com.smart_money.repository.UserRepository;
import org.springframework.stereotype.Service;

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
            if (updateUserDTO.name() != null) existingUser.setName(updateUserDTO.name());
            if (updateUserDTO.lastName() != null) existingUser.setLastName(updateUserDTO.lastName());
            if (updateUserDTO.email() != null) existingUser.setEmail(updateUserDTO.email());
            if (updateUserDTO.password() != null) existingUser.setPassword(updateUserDTO.password());
            if (updateUserDTO.age() != null) existingUser.setAge(updateUserDTO.age());
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
}
