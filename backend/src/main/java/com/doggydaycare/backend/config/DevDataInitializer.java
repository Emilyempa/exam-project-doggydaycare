package com.doggydaycare.backend.config;

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

@Component
@Profile("dev")
public class DevDataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataInitializer.class);

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public DevDataInitializer(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        boolean forceInit = args.containsOption("force");

        if (forceInit || userRepository.count() == 0) {
            log.info("Initializing dev data...");

            // Create Admin user
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

            // Create Staff user
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

            // Create Owner user
            var owner = UserEntity.builder()
                .email("owner@doggydaycare.com")
                .password(passwordEncoder.encode("owner123"))
                .firstName("Dog")
                .lastName("Owner")
                .mobileNumber("+46703456789")
                .emergencyContact("+46703456780")
                .role(Role.OWNER)
                .enabled(true)
                .deleted(false)
                .build();

            userRepository.save(admin);
            userRepository.save(staff);
            userRepository.save(owner);

            log.info("Dev data initialized: {} users created", userRepository.count());
            log.info("Test credentials:");
            log.info("  Admin - email: admin@doggydaycare.com, password: admin123");
            log.info("  Staff - email: staff@doggydaycare.com, password: staff123");
            log.info("  Owner - email: owner@doggydaycare.com, password: owner123");
        } else {
            log.info("Dev data already present. Skipping initialization. Use --force to reinitialize.");
        }
    }
}
