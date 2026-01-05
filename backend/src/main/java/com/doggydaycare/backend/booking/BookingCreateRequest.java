package com.doggydaycare.backend.booking;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record BookingCreateRequest(
    UUID dogId,

    UUID bookedById,

    LocalDate date,

    @NotNull(message = "Check in time is required")
    LocalTime expectedCheckInTime,

    @NotNull(message = "Check out time is required")
    LocalTime expectedCheckOutTime,

    String notes
) {}
