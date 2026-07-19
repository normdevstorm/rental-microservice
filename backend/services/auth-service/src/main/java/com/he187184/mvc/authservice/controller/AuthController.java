package com.he187184.mvc.authservice.controller;


import com.he187184.mvc.authservice.dto.request.LoginRequest;
import com.he187184.mvc.authservice.dto.request.RefreshTokenRequest;
import com.he187184.mvc.authservice.dto.request.RoleUpdateRequest;
import com.he187184.mvc.authservice.dto.request.SignupRequest;
import com.he187184.mvc.authservice.dto.response.JwtResponse;
import com.he187184.mvc.authservice.dto.response.MessageResponse;

import com.he187184.mvc.authservice.entity.Role;
import com.he187184.mvc.authservice.entity.User;
import com.he187184.mvc.authservice.mapper.AuthUserMapper;
import com.he187184.mvc.authservice.mapper.UserMapper;
import com.he187184.mvc.authservice.redis.RefreshTokenService;
import com.he187184.mvc.authservice.redis.TokenBlacklistService;
import com.he187184.mvc.authservice.redis.TokenVersionService;
import com.he187184.mvc.authservice.repository.UserRepository;
import com.he187184.mvc.authservice.security.jwt.JwtUtils;
import com.he187184.mvc.authservice.security.service.UserDetailsImpl;
import com.he187184.mvc.authservice.security.service.UserDetailsServiceImpl;
import com.he187184.mvc.authservice.service.impl.AuthService;
import com.he187184.mvc.authservice.service.impl.RoleService;
import com.he187184.mvc.authservice.service.UserService;
import jakarta.validation.Valid;

import org.example.commonlib.aspects.annotations.LoggingController;
import org.example.commonlib.dto.BaseResponse;
import org.example.commonlib.dto.ResponseCode;
import org.example.commonlib.security.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RequestMapping("/")
@RestController
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {

        this.authService = authService;
        this.userService = userService;
    }

    @LoggingController
    @PostMapping("/signin")
    public ResponseEntity<BaseResponse<JwtResponse>> login(@RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(new BaseResponse<>(ResponseCode.SUCCESS, true, jwtResponse));
    }

    @PostMapping("/signup")
    public ResponseEntity<BaseResponse<Object>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        authService.registerUser(signUpRequest);
        return ResponseEntity.ok(new BaseResponse<>(ResponseCode.SUCCESS, true, new MessageResponse("User registered successfully!")));
    }

    @PostMapping("/refresh-role")
    public ResponseEntity<BaseResponse<JwtResponse>> refreshTokenAfterAddingRole(@Valid @RequestBody RoleUpdateRequest roleUpdateRequest) {
        JwtResponse response = authService.handleAddingNewRoleToUser(roleUpdateRequest);
        return ResponseEntity.ok(new BaseResponse<>("Refresh Token succesfully", true, "200", response));
    }

    @PostMapping("/logoutone")
    public ResponseEntity<BaseResponse<Object>> logout(
            @RequestBody RefreshTokenRequest refreshTokenRequest,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        authService.logoutOne(refreshTokenRequest, authHeader);
        return ResponseEntity.ok(new BaseResponse<>("Delete refresh token and revoke access token  succesfully", true, "200", null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<BaseResponse<JwtResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest, BindingResult bindingResult) {
        JwtResponse jwtResponse = authService.refreshAccessToken(refreshTokenRequest,bindingResult);
        return ResponseEntity.ok( new BaseResponse<>("Refresh Token succesfully", true, "200", jwtResponse));
    }
    @PostMapping("/check-exists")
    public ResponseEntity<BaseResponse<Boolean>> checkEmailExists(@RequestParam String email) {
        BaseResponse<Boolean> response = new BaseResponse<>("Check email exists successfully", true, "200", userService.isEmailExist(email));
        return ResponseEntity.ok(response);
    }

}
