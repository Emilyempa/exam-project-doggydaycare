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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody UserCreateRequest request) {
        return userService.create(request);
    }

    /* =======================
       Read
       ======================= */

    //Get a list of all users
    @GetMapping
    public List<UserResponse> getAll() {
        return userService.getAll();
    }

    //Get a specific user by id
    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable UUID id) {

        return userService.getById(id);
    }

    //Get all dogs by user id to connect an owner and dogs
    @GetMapping("/{userId}/dogs")
    public List<DogResponse> getDogsByUserId(@PathVariable UUID userId) {
        return dogService.getByUserId(userId); }

    /* =======================
       Update
       ======================= */

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

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        userService.delete(id);
    }
}
