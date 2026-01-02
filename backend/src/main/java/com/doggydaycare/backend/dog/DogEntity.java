package com.doggydaycare.backend.dog;

import com.doggydaycare.backend.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.UUID;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "dogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private int age;

    private String breed;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String dogInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(nullable = false)
    private boolean deleted = false;

    /* =======================
       Audit fields
       ======================= */

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

     /* =======================
       JPA-safe equality
       ======================= */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DogEntity other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
