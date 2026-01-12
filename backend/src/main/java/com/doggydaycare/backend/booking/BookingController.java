package com.doggydaycare.backend.booking;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /* =======================
       Create
       ======================= */

    /**
     * Creates a new booking.
     * The booking is automatically confirmed if no conflict exists.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(
        @Valid @RequestBody BookingCreateRequest request
    ) {
        return bookingService.createBooking(request);
    }

    /* =======================
       Read
       ======================= */

    /**
     * Returns all non-deleted bookings.
     */
    @GetMapping
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookings();
    }

    /**
     * Returns a single booking by id.
     */
    @GetMapping("/{id}")
    public BookingResponse getBookingById(@PathVariable UUID id) {
        return bookingService.getBookingById(id);
    }

    /**
     * Returns all bookings for a specific date.
     */
    @GetMapping("/date/{date}")
    public List<BookingResponse> getBookingsByDate(
        @PathVariable
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate date
    ) {
        return bookingService.getBookingsByDate(date);
    }

    /**
     * Returns all bookings for a specific dog.
     */
    @GetMapping("/dog/{dogId}")
    public List<BookingResponse> getBookingsByDogId(@PathVariable UUID dogId) {
        return bookingService.getBookingsByDogId(dogId);
    }

    /**
     * Returns all bookings created by a specific user.
     */
    @GetMapping("/user/{userId}")
    public List<BookingResponse> getBookingsByUserId(@PathVariable UUID userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    /**
     * Returns all bookings with a specific status.
     */
    @GetMapping("/status/{status}")
    public List<BookingResponse> getBookingsByStatus(
        @PathVariable BookingStatus status
    ) {
        return bookingService.getBookingsByStatus(status);
    }

    /* =======================
       Update
       ======================= */

    /**
     * Partially updates an existing booking.
     * Only non-null fields are applied.
     */
    @PutMapping("/{id}")
    public BookingResponse updateBooking(
        @PathVariable UUID id,
        @Valid @RequestBody BookingUpdateRequest request
    ) {
        return bookingService.updateBooking(id, request);
    }

    /* =======================
       Booking lifecycle actions
       ======================= */

    /**
     * Marks a booking as checked in.
     */
    @PostMapping("/{id}/check-in")
    public BookingResponse checkIn(@PathVariable UUID id) {
        return bookingService.checkIn(id);
    }

    /**
     * Marks a booking as checked out.
     */
    @PostMapping("/{id}/check-out")
    public BookingResponse checkOut(@PathVariable UUID id) {
        return bookingService.checkOut(id);
    }

    /**
     * Cancels a booking.
     */
    @PostMapping("/{id}/cancel")
    public BookingResponse cancelBooking(@PathVariable UUID id) {
        return bookingService.cancelBooking(id);
    }

    /* =======================
       Delete (soft)
       ======================= */

    /**
     * Soft deletes a booking.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBooking(@PathVariable UUID id) {
        bookingService.deleteBooking(id);
    }
}
