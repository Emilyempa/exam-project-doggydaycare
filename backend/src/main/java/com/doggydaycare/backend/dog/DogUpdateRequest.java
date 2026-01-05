package com.doggydaycare.backend.dog;

import jakarta.validation.constraints.Min;

public record DogUpdateRequest(

    String name,

    @Min(value = 0, message = "Age must be 0 or greater")
    Integer age,
    String breed,
    String dogInfo
) {}
