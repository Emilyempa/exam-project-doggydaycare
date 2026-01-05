package com.doggydaycare.backend.user;

import java.util.UUID;

public record UserResponse(
    UUID id,
    String email,
    String firstName,
    String lastName,
    String fullName,
    String mobileNumber,
    String emergencyContact,
    Role role,
    boolean enabled
) {}
