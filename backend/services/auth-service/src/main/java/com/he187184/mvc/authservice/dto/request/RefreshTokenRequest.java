package com.he187184.mvc.authservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    @NotBlank
    private String refreshToken;
    @NotBlank
    private String deviceId;

}
