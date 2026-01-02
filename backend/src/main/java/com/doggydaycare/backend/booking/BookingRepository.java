package com.doggydaycare.backend.booking;

import com.doggydaycare.backend.dog.DogEntity;
import com.doggydaycare.backend.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<BookingEntity, UUID> {

    List<BookingEntity> findByDateAndDeletedFalse(LocalDate date);

    List<BookingEntity> findByDogAndDeletedFalse(DogEntity dog);

    List<BookingEntity> findByBookedByAndDeletedFalse(UserEntity user);

    List<BookingEntity> findByStatusAndDeletedFalse(BookingStatus status);

    /* =======================
       Existence / validation
       ======================= */

    boolean existsByDogAndDateAndDeletedFalse(DogEntity dog, LocalDate date);
}
