package com.he187184.mvc.authservice.dto.response;

import lombok.Data;

import java.util.Set;
@Data
public class JwtResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private Set<String> roles;

    public JwtResponse(String accessToken,String refreshToken, Long id, String username, String email, Set<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = email;
        this.email = username;
        this.roles = roles;
        this.refreshToken = refreshToken;
    }
}
