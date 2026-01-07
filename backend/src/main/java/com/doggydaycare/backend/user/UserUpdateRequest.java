package com.doggydaycare.backend.user;

public record UserUpdateRequest(
    String firstName,
    String lastName,
    String email,
    String mobileNumber,
    String emergencyContact,
    Boolean enabled
) {}


