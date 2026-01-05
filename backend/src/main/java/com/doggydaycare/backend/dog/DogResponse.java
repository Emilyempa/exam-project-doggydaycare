package com.doggydaycare.backend.dog;

import java.util.UUID;

public record DogResponse(
    UUID id,
    String name,
    int age,
    String breed,
    String dogInfo,
    UUID userId
) {}
