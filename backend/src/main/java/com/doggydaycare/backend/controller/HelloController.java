package com.doggydaycare.backend.controller;

import org.springframework.web.bind.annotation.*;
// Marks this class as a REST controller (returns JSON responses instead of HTML)
@RestController
// Base path for all endpoints in this controller
@RequestMapping("/api/v1/")
// Allows CORS requests from the frontend (Next.js on localhost:3000)
@CrossOrigin(origins = "http://localhost:3000")
public class HelloController {

    @GetMapping("/hello")
    public HelloResponse hello() {
        return new HelloResponse("Hello from Spring Boot!", "Backend is running");
    }

    @GetMapping("/hello/{name}")
    public HelloResponse helloName(@PathVariable String name) {
        return new HelloResponse(
                "Hello " + name + "!",
                "Doggy daycare backend is running"
        );
    }
}
// Record type used as a response object (automatically converted to JSON)
// Immutable and used for data transfer (DTO)
record HelloResponse(String message, String description) {}
