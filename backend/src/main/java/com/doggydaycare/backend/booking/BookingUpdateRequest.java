package com.doggydaycare.backend.booking;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingUpdateRequest(
    LocalDate date,
    LocalTime expectedCheckInTime,
    LocalTime expectedCheckOutTime,
    String notes
) {}
