package com.he187184.mvc.itemservice.client;

import com.he187184.mvc.authservice.dto.response.JwtResponse;
import com.he187184.mvc.itemservice.dto.RoleUpdateRequest;
import com.he187184.mvc.itemservice.dto.UserDTO;
import jakarta.validation.Valid;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Component
@FeignClient(name = "auth-service", fallback = UserClientFallback.class,configuration = FeignConfig.class)
public interface UserClient {
    @GetMapping("/users/{id}")
    BaseResponse<UserDTO> getUserById(@PathVariable("id") Long id);
    @PostMapping("/refresh-role")
     BaseResponse<JwtResponse> refreshTokenAfterAddingRole(@RequestBody RoleUpdateRequest roleUpdateRequest);
}
