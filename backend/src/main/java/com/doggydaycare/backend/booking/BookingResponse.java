package com.doggydaycare.backend.booking;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.UUID;

public record BookingResponse(
    UUID id,
    UUID dogId,
    String dogName,
    UUID bookedById,
    LocalDate date,
    LocalTime expectedCheckInTime,
    LocalTime expectedCheckOutTime,
    LocalTime actualCheckInTime,
    LocalTime actualCheckOutTime,
    BookingStatus status,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
