package com.doggydaycare.backend.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserCreateRequest(

    @NotBlank
    @Email
    String email,

    @NotBlank
    String password,

    @NotBlank
    String firstName,

    @NotBlank
    String lastName,

    @NotBlank
    String mobileNumber,

    @NotBlank
    String emergencyContact,

    Role role
) {}
