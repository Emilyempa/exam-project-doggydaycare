package com.doggydaycare.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    List<UserEntity> findByDeletedFalse();

    List<UserEntity> findByRoleAndDeletedFalse(Role role);

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
