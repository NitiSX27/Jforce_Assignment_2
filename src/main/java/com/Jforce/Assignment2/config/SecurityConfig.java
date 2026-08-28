package com.Jforce.Assignment2.config;

import org.springframework.context.annotation.Bean;
import com.Jforce.Assignment2.entity.User;
import com.Jforce.Assignment2.repository.UserRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Locale;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .httpBasic(Customizer.withDefaults())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/category/**",
                                "/api/categories").permitAll()
                        .requestMatchers("/api/products/admin").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/inventory/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/products").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/categories/**", "/api/roles/**", "/api/users/**")
                        .hasRole("SUPER_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/orders").hasRole("SUPER_ADMIN")
                        .anyRequest().authenticated())
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    UserDetailsService userDetailsService(UserRepository userRepository) {
        return email -> userRepository.findByEmail(email)
                .map(this::toUserDetails)
                .orElseThrow(() -> new org.springframework.security.core.userdetails
                        .UsernameNotFoundException("User not found: " + email));
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private org.springframework.security.core.userdetails.UserDetails toUserDetails(User user) {
        if (user.getRole() == null || user.getRole().getName() == null) {
            throw new IllegalStateException("User has no valid role: " + user.getEmail());
        }

        String role = user.getRole().getName().toUpperCase(Locale.ROOT)
                .replace(' ', '_')
                .replace('-', '_');
        if (role.startsWith("ROLE_")) {
            role = role.substring("ROLE_".length());
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(role)
                .build();
    }
}
