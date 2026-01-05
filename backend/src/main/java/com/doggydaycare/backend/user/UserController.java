package com.doggydaycare.backend.user;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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

    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable UUID id) {
        return userService.getById(id);
    }

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
