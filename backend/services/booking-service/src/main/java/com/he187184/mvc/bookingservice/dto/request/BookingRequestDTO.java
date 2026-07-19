package com.he187184.mvc.bookingservice.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import org.example.commonlib.security.SecurityUtils;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequestDTO {
    @NotNull(message = "Item ID is required")
    private Long itemId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}