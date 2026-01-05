package com.doggydaycare.backend.dog;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dogs")
public class DogController {

    private final DogService dogService;

    public DogController(DogService dogService) {
        this.dogService = dogService;
    }

     /* =======================
       Create
       ======================= */

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DogResponse create(@Valid @RequestBody DogCreateRequest request) {
        return dogService.create(request);
    }

    /* =======================
       Read
       ======================= */

    @GetMapping("/{id}")
    public DogResponse getById(@PathVariable UUID id) {
        return dogService.getById(id);
    }

    /* =======================
       Update
       ======================= */

    @PutMapping("/{id}")
    public DogResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody DogUpdateRequest request
    ) {
        return dogService.update(id, request);
    }

    /* =======================
       Delete (soft)
       ======================= */

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        dogService.delete(id);
    }
}

