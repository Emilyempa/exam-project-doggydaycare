package com.doggydaycare.backend.booking;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduled tasks for booking management.
 */
@Component
@RequiredArgsConstructor
public class ScheduledTask {

    private final BookingRepository bookingRepository;

    /**
     * Automatically marks past bookings as NO_SHOW if they were
     * never checked in on the actual date.
     * Runs every night at 00:00.
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void markPastBookingsAsNoShow() {
        LocalDate today = LocalDate.now();

        // Find all bookings that are CONFIRMED, before today, and NOT checked in
        List<BookingEntity> pastUnattendedBookings = bookingRepository
            .findByStatusAndDeletedFalse(BookingStatus.CONFIRMED).stream()
            .filter(b -> b.getDate().isBefore(today))
            .filter(b -> b.getActualCheckInTime() == null)
            .toList();

        // Mark them as NO_SHOW
        pastUnattendedBookings.forEach(b -> b.setStatus(BookingStatus.NO_SHOW));

        if (!pastUnattendedBookings.isEmpty()) {
            bookingRepository.saveAll(pastUnattendedBookings);
        }
    }
}
