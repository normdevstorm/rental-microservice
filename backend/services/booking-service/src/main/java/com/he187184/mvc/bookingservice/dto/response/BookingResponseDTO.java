package com.he187184.mvc.bookingservice.dto.response;

import com.he187184.mvc.bookingservice.dto.ItemDTO;
import com.he187184.mvc.bookingservice.dto.UserDTO;
import com.he187184.mvc.bookingservice.entity.Booking;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private Long id;
    private ItemDTO item;
    private UserDTO renter;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Booking.Status status;
    private Booking.PaymentStatus paymentStatus;
    @Nullable
    private String cancellationReason;
    private LocalDateTime createdAt;
    @Nullable
    private LocalDateTime updatedAt;
}