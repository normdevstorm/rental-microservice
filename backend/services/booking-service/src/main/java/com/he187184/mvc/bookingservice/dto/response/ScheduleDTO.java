package com.he187184.mvc.bookingservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDTO {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
