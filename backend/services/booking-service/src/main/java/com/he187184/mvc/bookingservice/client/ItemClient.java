package com.he187184.mvc.bookingservice.client;

import com.he187184.mvc.bookingservice.dto.ItemDTO;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
@Component
@FeignClient(name = "item-service", fallback = ItemClientFallback.class, configuration = FeignConfig.class)
public interface ItemClient {
    @GetMapping("/{id}")
    BaseResponse<ItemDTO> getItemById(@PathVariable("id") Long id);
}

