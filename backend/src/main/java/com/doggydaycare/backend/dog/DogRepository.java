package com.doggydaycare.backend.dog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DogRepository extends JpaRepository<DogEntity, UUID> {

    // Find all dogs for a specific user
    List<DogEntity> findByUserId(UUID userId);

    // Find a specific dog for a specific user (safety check)
    Optional<DogEntity> findByIdAndUserId(UUID id, UUID userId);
}
