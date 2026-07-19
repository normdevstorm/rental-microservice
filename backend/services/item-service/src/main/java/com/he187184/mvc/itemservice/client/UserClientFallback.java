package com.he187184.mvc.itemservice.client;

import com.he187184.mvc.authservice.dto.request.RoleUpdateRequest;
import com.he187184.mvc.authservice.dto.response.JwtResponse;
import com.he187184.mvc.itemservice.dto.UserDTO;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.stereotype.Component;

@Component
public class UserClientFallback implements UserClient {

    @Override
    public BaseResponse<UserDTO> getUserById(Long id) {
        return null;
    }

    @Override
    public BaseResponse<JwtResponse> refreshTokenAfterAddingRole(com.he187184.mvc.itemservice.dto.RoleUpdateRequest roleUpdateRequest) {
        return null;
    }


}
