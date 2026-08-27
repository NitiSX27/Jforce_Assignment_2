package com.Jforce.Assignment2.service;

import com.Jforce.Assignment2.entity.Roles;
import com.Jforce.Assignment2.entity.User;
import com.Jforce.Assignment2.repository.RolesRepository;
import com.Jforce.Assignment2.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RolesRepository rolesRepository;

    public UserService(UserRepository userRepository, RolesRepository rolesRepository) {
        this.userRepository = userRepository;
        this.rolesRepository = rolesRepository;
    }

    public User addUser(User user, Long roleId) {
        Roles role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role Not Found"));

        user.setRole(role);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
    }

    public User updateUser(Long id, User user) {
        User existingUser = getUserById(id);
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        return userRepository.save(existingUser);
    }

    public User updateUserRole(Long userId, Long roleId) {
        User user = getUserById(userId);
        Roles role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role Not Found"));

        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}
