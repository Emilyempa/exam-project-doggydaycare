package com.doggydaycare.backend.dog;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record DogCreateRequest(

    @NotBlank(message = "Dog name is required")
    String name,

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be 0 or greater")
    Integer age,

    String breed,

    String dogInfo,

    @NotNull(message = "Owner (user ID) is required")
    UUID userId
) {}
