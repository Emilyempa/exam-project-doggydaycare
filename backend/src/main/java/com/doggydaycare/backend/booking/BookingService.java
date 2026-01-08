package com.doggydaycare.backend.booking;

import com.doggydaycare.backend.dog.DogEntity;
import com.doggydaycare.backend.dog.DogRepository;
import com.doggydaycare.backend.user.UserEntity;
import com.doggydaycare.backend.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingService {

    private static final String BOOKING_NOT_FOUND = "Booking not found with id: ";
    private static final String DOG_NOT_FOUND = "Dog not found with id: ";
    private static final String USER_NOT_FOUND = "User not found with id: ";

    private final BookingRepository bookingRepository;
    private final DogRepository dogRepository;
    private final UserRepository userRepository;

    private final BookingService self;


    /* =======================
       Create
       ======================= */

    /**
     * Creates a new booking.
     * A booking is automatically confirmed if no booking exists
     * for the same dog on the same date.
     */
    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request) {

        // Validate dog exists
        DogEntity dog = dogRepository.findById(request.dogId())
            .orElseThrow(() -> new EntityNotFoundException(DOG_NOT_FOUND + request.dogId()));

        // Validate user exists
        UserEntity bookedBy = userRepository.findById(request.bookedById())
            .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND + request.bookedById()));

        // Enforce one booking per dog per day
        if (bookingRepository.existsByDogAndDateAndDeletedFalse(dog, request.date())) {
            throw new IllegalStateException(
                "A booking already exists for this dog on " + request.date()
            );
        }

        BookingEntity booking = BookingEntity.builder()
            .date(request.date())
            .expectedCheckInTime(request.expectedCheckInTime())
            .expectedCheckOutTime(request.expectedCheckOutTime())
            .notes(request.notes()) // optional
            .status(BookingStatus.CONFIRMED)
            .dog(dog)
            .bookedBy(bookedBy)
            .deleted(false)
            .build();

        BookingEntity saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    /* =======================
       Read
       ======================= */

    /**
     * Returns all non-deleted bookings.
     */
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
            .filter(booking -> !booking.isDeleted())
            .map(this::toResponse)
            .toList();
    }

    /**
     * Returns a single booking by id.
     */
    public BookingResponse getBookingById(UUID id) {
        return toResponse(findBookingById(id));
    }

    /**
     * Returns all bookings for a specific date.
     */
    public List<BookingResponse> getBookingsByDate(LocalDate date) {
        return bookingRepository.findByDateAndDeletedFalse(date).stream()
            .map(this::toResponse)
            .toList();
    }

    /**
     * Returns all bookings for a specific dog.
     */
    public List<BookingResponse> getBookingsByDogId(UUID dogId) {
        DogEntity dog = dogRepository.findById(dogId)
            .orElseThrow(() -> new EntityNotFoundException(DOG_NOT_FOUND + dogId));

        return bookingRepository.findByDogAndDeletedFalse(dog).stream()
            .map(this::toResponse)
            .toList();
    }

    /**
     * Returns all bookings created by a specific user.
     */
    public List<BookingResponse> getBookingsByUserId(UUID userId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND + userId));

        return bookingRepository.findByBookedByAndDeletedFalse(user).stream()
            .map(this::toResponse)
            .toList();
    }

    /**
     * Returns bookings by booking status.
     */
    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatusAndDeletedFalse(status).stream()
            .map(this::toResponse)
            .toList();
    }

    /* =======================
       Update (partial)
       ======================= */

    /**
     * Partially updates a booking.
     * Only non-null fields are applied.
     */
    @Transactional
    public BookingResponse updateBooking(UUID id, BookingUpdateRequest request) {
        BookingEntity booking = findBookingById(id);

        if (request.date() != null) {
            booking.setDate(request.date());
        }
        if (request.expectedCheckInTime() != null) {
            booking.setExpectedCheckInTime(request.expectedCheckInTime());
        }
        if (request.expectedCheckOutTime() != null) {
            booking.setExpectedCheckOutTime(request.expectedCheckOutTime());
        }
        if (request.notes() != null) {
            booking.setNotes(request.notes());
        }

        return toResponse(booking);
    }

    /* =======================
       Booking lifecycle actions
       ======================= */

    /**
     * Marks a booking as checked in.
     */
    @Transactional
    public BookingResponse checkIn(UUID id) {
        BookingEntity booking = findBookingById(id);
        booking.checkIn();
        return toResponse(booking);
    }

    /**
     * Marks a booking as checked out.
     */
    @Transactional
    public BookingResponse checkOut(UUID id) {
        BookingEntity booking = findBookingById(id);
        booking.checkOut();
        return toResponse(booking);
    }

    /**
     * Cancels a booking.
     */
    @Transactional
    public BookingResponse cancelBooking(UUID id) {
        BookingEntity booking = findBookingById(id);
        booking.cancel();
        return toResponse(booking);
    }

    /**
     * Automatically marks past bookings as NO_SHOW if they were
     * never checked on the actual date the day.
     */
    @Scheduled(cron = "0 0 0 * * *") // every night kl 00:00
    @Transactional
    public void nightlyMarkNoShow() {
        self.markPastBookingsAsNoShowIfNotCheckedIn();
    }

    @Transactional
    public void markPastBookingsAsNoShowIfNotCheckedIn() {
        LocalDate today = LocalDate.now();

        // Find all bookings that are CONFIRMED, before today, and NOT checked in
        List<BookingEntity> pastUnattendedBookings = bookingRepository
            .findByStatusAndDeletedFalse(BookingStatus.CONFIRMED).stream()
            .filter(b -> b.getDate().isBefore(today))
            .filter(b -> b.getActualCheckInTime() == null) // Only those not checked in
            .toList();

        // Mark them as NO_SHOW
        pastUnattendedBookings.forEach(b -> b.setStatus(BookingStatus.NO_SHOW));

        if (!pastUnattendedBookings.isEmpty()) {
            bookingRepository.saveAll(pastUnattendedBookings);
        }
    }


    /* =======================
       Delete (soft delete)
       ======================= */

    /**
     * Soft deletes a booking.
     */
    @Transactional
    public void deleteBooking(UUID id) {
        BookingEntity booking = findBookingById(id);
        booking.setDeleted(true);
    }

    /* =======================
       Internal helpers
       ======================= */

    /**
     * Returns a non-deleted booking or throws if not found.
     */
    private BookingEntity findBookingById(UUID id) {
        return bookingRepository.findById(id)
            .filter(booking -> !booking.isDeleted())
            .orElseThrow(() -> new EntityNotFoundException(BOOKING_NOT_FOUND + id));
    }

    /**
     * Maps entity to response DTO.
     */
    private BookingResponse toResponse(BookingEntity booking) {
        return new BookingResponse(
            booking.getId(),
            booking.getDog().getId(),
            booking.getDog().getName(),
            booking.getBookedBy().getId(),
            booking.getDate(),
            booking.getExpectedCheckInTime(),
            booking.getExpectedCheckOutTime(),
            booking.getActualCheckInTime(),
            booking.getActualCheckOutTime(),
            booking.getStatus(),
            booking.getNotes(),
            booking.getCreatedAt(),
            booking.getUpdatedAt()
        );
    }
}
