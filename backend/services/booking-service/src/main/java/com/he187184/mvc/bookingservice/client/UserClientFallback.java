package com.he187184.mvc.bookingservice.client;

import com.he187184.mvc.bookingservice.dto.UserDTO;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.stereotype.Component;

@Component
public class UserClientFallback implements UserClient {

    @Override
    public BaseResponse<UserDTO> getUserById(Long id) {
        return null;
    }
}

