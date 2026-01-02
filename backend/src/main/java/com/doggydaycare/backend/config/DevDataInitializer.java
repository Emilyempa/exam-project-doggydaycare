package com.doggydaycare.backend.config;

import com.doggydaycare.backend.booking.BookingRepository;
import com.doggydaycare.backend.booking.BookingEntity;
import com.doggydaycare.backend.booking.BookingStatus;
import com.doggydaycare.backend.dog.DogEntity;
import com.doggydaycare.backend.dog.DogRepository;
import com.doggydaycare.backend.user.Role;
import com.doggydaycare.backend.user.UserEntity;
import com.doggydaycare.backend.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
@Profile("dev")
public class DevDataInitializer implements ApplicationRunner {

    private static final Logger LOG = LoggerFactory.getLogger(DevDataInitializer.class);

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final DogRepository dogRepository;
    private final BookingRepository bookingRepository;

    public DevDataInitializer(
        PasswordEncoder passwordEncoder,
        UserRepository userRepository,
        DogRepository dogRepository,
        BookingRepository bookingRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.dogRepository = dogRepository;
        this.bookingRepository = bookingRepository;

    }

    @Override
    public void run(ApplicationArguments args) {
        boolean forceInit = args.containsOption("force");

        if (forceInit || userRepository.count() == 0) {
            LOG.info("Initializing dev data...");

            // Create Admin user with DUMMYPASSWORD
            var admin = UserEntity.builder()
                .email("admin@doggydaycare.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("User")
                .mobileNumber("+46701234567")
                .emergencyContact("+46701234568")
                .role(Role.ADMIN)
                .enabled(true)
                .deleted(false)
                .build();

            // Create a Staff user with DUMMYPASSWORD
            var staff = UserEntity.builder()
                .email("staff@doggydaycare.com")
                .password(passwordEncoder.encode("staff123"))
                .firstName("Staff")
                .lastName("Member")
                .mobileNumber("+46702345678")
                .emergencyContact("+46702345679")
                .role(Role.STAFF)
                .enabled(true)
                .deleted(false)
                .build();

            // Create Owners one and two with DUMMYPASSWORDS
            var ownerOne = UserEntity.builder()
                .email("ownerone@doggydaycare.com")
                .password(passwordEncoder.encode("ownerone123"))
                .firstName("Dog")
                .lastName("Owner")
                .mobileNumber("+46703456789")
                .emergencyContact("+46703456780")
                .role(Role.OWNER)
                .enabled(true)
                .deleted(false)
                .build();

            var ownerTwo = UserEntity.builder()
                .email("ownertwo@doggydaycare.com")
                .password(passwordEncoder.encode("ownertwo123"))
                .firstName("Doggy")
                .lastName("OwnerTwo")
                .mobileNumber("+46703451984")
                .emergencyContact("+46703336781")
                .role(Role.OWNER)
                .enabled(true)
                .deleted(false)
                .build();


            userRepository.save(admin);
            userRepository.save(staff);
            userRepository.save(ownerOne);
            userRepository.save(ownerTwo);

            // Create Dogs for owners

            var bonnie = DogEntity.builder()
                .name("Bonnie")
                .age(1)
                .breed("Labrador")
                .dogInfo("Friendly and energetic, love treats but on a diet")
                .user(ownerOne)
                .deleted(false)
                .build();

            var peggy = DogEntity.builder()
                .name("Peggy")
                .age(2)
                .breed("Pitbull")
                .dogInfo("Gets cold on walks and uses a jacket")
                .user(ownerOne)
                .deleted(false)
                .build();

            var gunvald = DogEntity.builder()
                .name("Gunvald")
                .age(3)
                .breed("Golden Retriever")
                .dogInfo("Needs a lot of attention")
                .user(ownerTwo)
                .deleted(false)
                .build();

            dogRepository.save(bonnie);
            dogRepository.save(peggy);
            dogRepository.save(gunvald);

            // Create Bookings

            var todayBookingBonnie = BookingEntity.builder()
                .date(LocalDate.now())
                .expectedCheckInTime(LocalTime.of(8, 0))
                .expectedCheckOutTime(LocalTime.of(16, 0))
                .status(BookingStatus.PENDING)
                .dog(bonnie)
                .bookedBy(ownerOne)
                .notes("First daycare visit for Bonnie")
                .deleted(false)
                .build();

            var pastBookingPeggy = BookingEntity.builder()
                .date(LocalDate.now().minusDays(1))
                .expectedCheckInTime(LocalTime.of(8, 30))
                .expectedCheckOutTime(LocalTime.of(15, 30))
                .actualCheckInTime(LocalTime.of(8, 25))
                .actualCheckOutTime(LocalTime.of(15, 20))
                .status(BookingStatus.CHECKED_OUT)
                .dog(peggy)
                .bookedBy(ownerOne)
                .notes("Peggy was calm and playful")
                .deleted(false)
                .build();

            var cancelledBookingGunvald = BookingEntity.builder()
                .date(LocalDate.now().plusDays(1))
                .expectedCheckInTime(LocalTime.of(9, 0))
                .expectedCheckOutTime(LocalTime.of(17, 0))
                .status(BookingStatus.CANCELLED)
                .dog(gunvald)
                .bookedBy(ownerTwo)
                .notes("Owner cancelled due to sickness")
                .deleted(false)
                .build();

            bookingRepository.save(todayBookingBonnie);
            bookingRepository.save(pastBookingPeggy);
            bookingRepository.save(cancelledBookingGunvald);

            LOG.info("  OwnerOne - email: ownerone@doggydaycare.com, dummyPassword: ownerone123");
            LOG.info("  OwnerTwo - email: ownertwo@doggydaycare.com, dummyPassword: ownertwo123");

            LOG.info("Dev data summary:");
            LOG.info("  Users: {}", userRepository.count());
            LOG.info("  Dogs: {}", dogRepository.count());
            LOG.info("  Bookings: {}", bookingRepository.count());

        } else {
            LOG.info("Dev data already present. Skipping initialization. Use --force to reinitialize.");
        }
    }
}
