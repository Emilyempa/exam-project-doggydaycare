package com.doggydaycare.backend.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

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
    @Pattern(
        regexp = "^(\\+46|0)[1-9]\\d{1,2}-?\\d{3}\\s?\\d{2}\\s?\\d{2}$",
        message = "Invalid Swedish phone number format"
    )
    String mobileNumber,

    @NotBlank
    @Pattern(
        regexp = "^(\\+46|0)[1-9]\\d{1,2}-?\\d{3}\\s?\\d{2}\\s?\\d{2}$",
        message = "Invalid Swedish phone number format"
    )
    String emergencyContact,

    Role role
) {}
