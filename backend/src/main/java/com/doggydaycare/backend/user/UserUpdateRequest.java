package com.doggydaycare.backend.user;

public record UserUpdateRequest(
    String firstName,
    String lastName,
    String mobileNumber,
    String emergencyContact,
    Boolean enabled
) {}


