package com.doggydaycare.backend.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private static final String USER_NOT_FOUND = "User not found";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /* =======================
       Create
       ======================= */

    public UserResponse create(UserCreateRequest request) {
        UserEntity user = UserEntity.builder()
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .firstName(request.firstName())
            .lastName(request.lastName())
            .mobileNumber(request.mobileNumber())
            .emergencyContact(request.emergencyContact())
            .role(request.role())
            .enabled(true)
            .deleted(false)
            .build();

        UserEntity saved = userRepository.save(user);
        return toResponse(saved);
    }

    /* =======================
       Read
       ======================= */

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findByRoleAndDeletedFalse(Role.OWNER).stream()
            .map(UserService::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));

        return toResponse(user);
    }

    /* =======================
       Update (partial)
       ======================= */

    public UserResponse update(UUID id, UserUpdateRequest request) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));

        applyUpdates(user, request);

        return toResponse(user);
    }

    /* =======================
       Delete (soft delete)
       ======================= */

    public void delete(UUID id) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));

        user.setDeleted(true);
        user.setEnabled(false);
    }

    /* =======================
       Mapping / pure helpers
       ======================= */

    private static void applyUpdates(UserEntity user, UserUpdateRequest request) {
        if (request.firstName() != null) {
            user.setFirstName(request.firstName());
        }
        if (request.lastName() != null) {
            user.setLastName(request.lastName());
        }
        if (request.mobileNumber() != null) {
            user.setMobileNumber(request.mobileNumber());
        }
        if (request.emergencyContact() != null) {
            user.setEmergencyContact(request.emergencyContact());
        }
        if (request.enabled() != null) {
            user.setEnabled(request.enabled());
        }
    }

    private static UserResponse toResponse(UserEntity user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getFullName(),
            user.getMobileNumber(),
            user.getEmergencyContact(),
            user.getRole(),
            user.isEnabled()
        );
    }
}

