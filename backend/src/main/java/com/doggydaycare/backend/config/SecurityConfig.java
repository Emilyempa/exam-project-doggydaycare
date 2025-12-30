package com.doggydaycare.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
                // Disable CSRF protection (useful during development)
                .csrf(AbstractHttpConfigurer::disable)
                // Enable CORS with custom configuration defined below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Authorization rules: currently allow ALL requests without authentication (ONLY UNDER DEVELOPMENT)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow requests only from the Next.js frontend on localhost:3000
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
        // Allow common HTTP methods for REST APIs
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Allow all headers (e.g., Authorization, Content-Type)
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        // Allow cookies/credentials to be sent with requests (important for sessions or auth tokens)
        configuration.setAllowCredentials(true);

        // Apply this CORS configuration to all endpoints (/**)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
