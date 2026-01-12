package com.doggydaycare.backend.auth;

import java.util.UUID;

public record LogInResponse(
    UUID id,
    String email,
    String role,
    String token
) {}

