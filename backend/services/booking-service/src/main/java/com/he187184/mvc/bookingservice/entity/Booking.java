package com.he187184.mvc.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long itemId;
    private Long renterId;
    // TODO: Add ownerId when item service integration is ready
    // private Integer ownerId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private String cancellationReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.PENDING;
        }
        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.INITIAL;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING,
        CONFIRMED,
        CANCELLED,
        COMPLETED,
        NEGOTIATION
    }

    public enum PaymentStatus {
        INITIAL,
        DEPOSIT_PAID,
        RENTAL_PAID,
        DEPOSIT_REFUNDED,
        FULLY_PAID
    }
}