package com.he187184.mvc.mailservice.client;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.stereotype.Component;

@Component
public class AuthClientFallback implements AuthService {

    @Override
    public BaseResponse<Boolean> checkEmailExists(String email) {
        return null;
    }
}

