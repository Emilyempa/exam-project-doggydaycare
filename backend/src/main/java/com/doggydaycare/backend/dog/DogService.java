package com.doggydaycare.backend.dog;

import com.doggydaycare.backend.user.UserEntity;
import com.doggydaycare.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class DogService {

    private static final String DOG_NOT_FOUND = "Dog not found";
    private static final String USER_NOT_FOUND = "User not found";

    private final DogRepository dogRepository;
    private final UserRepository userRepository;

    public DogService(
        DogRepository dogRepository,
        UserRepository userRepository
    ) {
        this.dogRepository = dogRepository;
        this.userRepository = userRepository;
    }

    /* =======================
       Create
       ======================= */

    public DogResponse create(DogCreateRequest request) {
        UserEntity owner = userRepository.findById(request.userId())
            .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));

        DogEntity dog = DogEntity.builder()
            .name(request.name())
            .age(request.age())
            .breed(request.breed())
            .dogInfo(request.dogInfo())
            .user(owner)
            .deleted(false)
            .build();

        DogEntity saved = dogRepository.save(dog);
        return toResponse(saved);
    }

    /* =======================
       Read
       ======================= */

    @Transactional(readOnly = true)
    public DogResponse getById(UUID id) {
        DogEntity dog = dogRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(DOG_NOT_FOUND));

        return toResponse(dog);
    }

    @Transactional(readOnly = true)
    public List<DogResponse> getAll() {
        return dogRepository.findAll().stream()
            .filter(dog -> !dog.isDeleted())
            .map(DogService::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<DogResponse> getByUserId(UUID userId) {
        return dogRepository.findByUserId(userId).stream()
            .filter(dog -> !dog.isDeleted())
            .map(DogService::toResponse)
            .toList();
    }

    /* =======================
       Update (partial)
       ======================= */

    public DogResponse update(UUID id, DogUpdateRequest request) {
        DogEntity dog = dogRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(DOG_NOT_FOUND));

        applyUpdates(dog, request);

        return toResponse(dog);
    }

    /* =======================
       Delete (soft delete)
       ======================= */

    public void delete(UUID id) {
        DogEntity dog = dogRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(DOG_NOT_FOUND));

        dog.setDeleted(true);
    }

    /* =======================
       Mapping / pure helpers
       ======================= */

    private static void applyUpdates(DogEntity dog, DogUpdateRequest request) {
        if (request.name() != null) {
            dog.setName(request.name());
        }
        if (request.age() != null) {
            dog.setAge(request.age());
        }
        if (request.breed() != null) {
            dog.setBreed(request.breed());
        }
        if (request.dogInfo() != null) {
            dog.setDogInfo(request.dogInfo());
        }
    }

    private static DogResponse toResponse(DogEntity dog) {
        return new DogResponse(
            dog.getId(),
            dog.getName(),
            dog.getAge(),
            dog.getBreed(),
            dog.getDogInfo(),
            dog.getUser().getId()
        );
    }
}
