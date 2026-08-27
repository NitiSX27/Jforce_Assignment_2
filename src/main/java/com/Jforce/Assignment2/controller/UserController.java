package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.User;
import com.Jforce.Assignment2.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User addUser(@RequestBody User user, @RequestParam Long roleId) {
        return userService.addUser(user, roleId);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{userId}/role/{roleId}")
    public User updateUserRole(@PathVariable Long userId, @PathVariable Long roleId) {
        return userService.updateUserRole(userId, roleId);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
