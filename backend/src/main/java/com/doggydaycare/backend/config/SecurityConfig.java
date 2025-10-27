package com.doggydaycare.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
// Marks this class as a configuration class for Spring
@Configuration
// Enables Spring Security’s web security support
@EnableWebSecurity
public class SecurityConfig {
    // Defines the security filter chain, how incoming HTTP requests are secured
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disables CSRF (Cross-Site Request Forgery) protection for simplicity during development
                //TODO Remember to enable this later when you implement authentication or session handling
                .csrf(csrf -> csrf.disable())
                // Enables CORS support so the frontend (on a different port) can call this API
                .cors(cors -> cors.configure(http))
                // Defines authorization rules for incoming HTTP requests
                .authorizeHttpRequests(auth -> auth
                        // Allow all requests to any endpoint starting with /api/
                        .requestMatchers("/api/**").permitAll()
                        // Any other request must be authenticated
                        .anyRequest().authenticated()
                );
        // Builds and returns the configured security filter chain
        return http.build();
    }
}