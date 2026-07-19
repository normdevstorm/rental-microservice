package com.he187184.mvc.bookingservice.client;

import com.he187184.mvc.bookingservice.dto.UserDTO;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Component
@FeignClient(name = "auth-service", fallback = UserClientFallback.class,configuration = FeignConfig.class)
public interface UserClient {
    @GetMapping("/users/{id}")
    BaseResponse<UserDTO> getUserById(@PathVariable("id") Long id);
}

