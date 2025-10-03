package com.he187184.mvc.itemservice.client;

import org.example.commonlib.dto.BaseResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;

@Component
public class BookingClientFallback implements BookingClient {
    @Override
    public BaseResponse<Set<Long>> getUnavailableItemIdsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return new BaseResponse<>("Fallback: fail to fetch data from booking-service", false, String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()), null);
    }
}
