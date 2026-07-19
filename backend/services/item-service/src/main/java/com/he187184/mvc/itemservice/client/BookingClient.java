package com.he187184.mvc.itemservice.client;

import org.example.commonlib.dto.BaseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Component
@FeignClient(name = "booking-service", fallback = BookingClientFallback.class,configuration = FeignConfig.class)
public interface BookingClient {
    @GetMapping("/unavailable-items")
    BaseResponse<Set<Long>> getUnavailableItemIdsByDateRange(@RequestParam  LocalDateTime startDate, @RequestParam  LocalDateTime endDate);
}
