package com.doggydaycare.backend.booking;


import com.doggydaycare.backend.dog.DogEntity;
import com.doggydaycare.backend.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(
    name = "bookings",
    indexes = {
        @Index(name = "idx_booking_date", columnList = "date"),
        @Index(name = "idx_booking_status", columnList = "status"),
        @Index(name = "idx_booking_dog", columnList = "dog_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "expected_check_in_time")
    private LocalTime expectedCheckInTime;

    @Column(name = "expected_check_out_time")
    private LocalTime expectedCheckOutTime;

    @Column(name = "actual_check_in_time")
    private LocalTime actualCheckInTime;

    @Column(name = "actual_check_out_time")
    private LocalTime actualCheckOutTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dog_id", nullable = false)
    private DogEntity dog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booked_by_id", nullable = false)
    private UserEntity bookedBy;

     /* =======================
       Audit fields
       ======================= */

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    /* =======================
       Business methods
       ======================= */

    public void checkIn() {
        if (this.status == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Cannot check in a cancelled booking");
        }
        if (this.status == BookingStatus.CHECKED_IN) {
            throw new IllegalStateException("Booking already checked in");
        }
        if (this.status == BookingStatus.CHECKED_OUT) {
            throw new IllegalStateException("Booking already completed");
        }
        this.actualCheckInTime = LocalTime.now();
        this.status = BookingStatus.CHECKED_IN;
    }

    public void checkOut() {
        if (this.status != BookingStatus.CHECKED_IN) {
            throw new IllegalStateException("Must be checked in before checking out");
        }
        this.actualCheckOutTime = LocalTime.now();
        this.status = BookingStatus.CHECKED_OUT;
    }

    public void cancel() {
        if (this.status == BookingStatus.CHECKED_IN) {
            throw new IllegalStateException("Cannot cancel a booking that is already checked in");
        }
        if (this.status == BookingStatus.CHECKED_OUT) {
            throw new IllegalStateException("Cannot cancel a completed booking");
        }
        if (this.status == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled");
        }
        this.status = BookingStatus.CANCELLED;
    }

     /* =======================
       JPA-safe equality
       ======================= */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BookingEntity other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
