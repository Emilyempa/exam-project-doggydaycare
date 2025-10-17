package com.doggydaycare.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
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

record HelloResponse(String message, String description) {}
