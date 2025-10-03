package com.he187184.mvc.mailservice.client;

import org.example.commonlib.dto.BaseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Component
@FeignClient(name = "auth-service", fallback = AuthClientFallback.class,configuration = FeignConfig.class)
public interface AuthService {
    @PostMapping("/check-exists")
    BaseResponse<Boolean> checkEmailExists(@RequestParam("email") String email);
}

