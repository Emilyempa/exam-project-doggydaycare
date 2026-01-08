package com.doggydaycare.backend.booking;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<BookingResponse> createBooking(
        @Valid @RequestBody BookingCreateRequest request
    ) {
        BookingResponse created = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /* =======================
       Read
       ======================= */

    /**
     * Returns all non-deleted bookings.
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    /**
     * Returns a single booking by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    /**
     * Returns all bookings for a specific date.
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<BookingResponse>> getBookingsByDate(
        @PathVariable
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate date
    ) {
        return ResponseEntity.ok(bookingService.getBookingsByDate(date));
    }

    /**
     * Returns all bookings for a specific dog.
     */
    @GetMapping("/dog/{dogId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByDogId(@PathVariable UUID dogId) {
        return ResponseEntity.ok(bookingService.getBookingsByDogId(dogId));
    }

    /**
     * Returns all bookings created by a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    /**
     * Returns all bookings with a specific status.
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingResponse>> getBookingsByStatus(
        @PathVariable BookingStatus status
    ) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }

    /* =======================
       Update
       ======================= */

    /**
     * Partially updates an existing booking.
     * Only non-null fields are applied.
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateBooking(
        @PathVariable UUID id,
        @Valid @RequestBody BookingUpdateRequest request
    ) {
        return ResponseEntity.ok(bookingService.updateBooking(id, request));
    }

    /* =======================
       Booking lifecycle actions
       ======================= */

    /**
     * Marks a booking as checked in.
     */
    @PostMapping("/{id}/check-in")
    public ResponseEntity<BookingResponse> checkIn(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.checkIn(id));
    }

    /**
     * Marks a booking as checked out.
     */
    @PostMapping("/{id}/check-out")
    public ResponseEntity<BookingResponse> checkOut(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.checkOut(id));
    }

    /**
     * Cancels a booking.
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    /* =======================
       Delete (soft)
       ======================= */

    /**
     * Soft deletes a booking.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable UUID id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
