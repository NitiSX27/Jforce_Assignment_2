package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.dto.AuthResponse;
import com.Jforce.Assignment2.entity.User;
import com.Jforce.Assignment2.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public AuthResponse currentUser(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .orElseThrow(() -> new IllegalStateException("Authenticated user has no role"));

        return new AuthResponse(user.getId(), user.getEmail(), role);
    }
}
