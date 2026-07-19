package com.he187184.mvc.bookingservice.client;

import com.he187184.mvc.bookingservice.dto.ItemDTO;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.stereotype.Component;

@Component
public class ItemClientFallback implements ItemClient {
    @Override
    public BaseResponse<ItemDTO> getItemById(Long id) {
        return new BaseResponse<>("Fallback: item-service unavailable", false, "SERVICE_UNAVAILABLE", null);

    }
}

