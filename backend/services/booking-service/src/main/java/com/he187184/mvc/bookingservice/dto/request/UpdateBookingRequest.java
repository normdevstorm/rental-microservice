package com.he187184.mvc.bookingservice.dto.request;

import com.he187184.mvc.bookingservice.entity.Booking;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter @Setter
public class UpdateBookingRequest {
    private Booking.Status status;
    private Booking.PaymentStatus paymentStatus;
    private String cancellationReason;
}
