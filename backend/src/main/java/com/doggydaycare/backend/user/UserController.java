package com.doggydaycare.backend.user;

import com.doggydaycare.backend.dog.DogResponse;
import com.doggydaycare.backend.dog.DogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final DogService dogService;

    public UserController(UserService userService, DogService dogService) {
        this.userService = userService;
        this.dogService = dogService;
    }

    /* =======================
       Create
       ======================= */

    /**
     * Creates a new user.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody UserCreateRequest request) {
        return userService.create(request);
    }

    /* =======================
       Read
       ======================= */

    /**
     * Returns all users.
     */
    @GetMapping
    public List<UserResponse> getAll() {
        return userService.getAll();
    }

    /**
     * Returns a single user by id.
     */
    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable UUID id) {
        return userService.getById(id);
    }

    /**
     * Returns all dogs belonging to a specific user.
     */
    @GetMapping("/{userId}/dogs")
    public List<DogResponse> getDogsByUserId(@PathVariable UUID userId) {
        return dogService.getByUserId(userId);
    }

    /* =======================
       Update
       ======================= */

    /**
     * Updates an existing user.
     */
    @PutMapping("/{id}")
    public UserResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody UserUpdateRequest request
    ) {
        return userService.update(id, request);
    }

    /* =======================
       Delete (soft)
       ======================= */

    /**
     * Soft deletes a user.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        userService.delete(id);
    }
}
