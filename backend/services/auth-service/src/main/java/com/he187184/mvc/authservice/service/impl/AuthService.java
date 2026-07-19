package com.he187184.mvc.authservice.service.impl;

import com.he187184.mvc.authservice.dto.request.LoginRequest;
import com.he187184.mvc.authservice.dto.request.RefreshTokenRequest;
import com.he187184.mvc.authservice.dto.request.RoleUpdateRequest;
import com.he187184.mvc.authservice.dto.request.SignupRequest;
import com.he187184.mvc.authservice.dto.response.JwtResponse;
import com.he187184.mvc.authservice.entity.Role;
import com.he187184.mvc.authservice.entity.User;
import com.he187184.mvc.authservice.mapper.AuthUserMapper;
import com.he187184.mvc.authservice.redis.RefreshTokenService;
import com.he187184.mvc.authservice.redis.TokenBlacklistService;
import com.he187184.mvc.authservice.redis.TokenVersionService;
import com.he187184.mvc.authservice.repository.UserRepository;
import com.he187184.mvc.authservice.security.jwt.JwtUtils;
import com.he187184.mvc.authservice.security.service.UserDetailsImpl;
import com.he187184.mvc.authservice.service.UserService;
import org.example.commonlib.exception.custom.ApiException;
import org.example.commonlib.exception.custom.EmailExistException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final AuthUserMapper authUserMapper;
    private final RoleService roleService;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final TokenVersionService tokenVersionService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder encoder,
            JwtUtils jwtUtils,
            AuthUserMapper authUserMapper,
            RoleService roleService,
            UserService userService,
            RefreshTokenService refreshTokenService,
            TokenVersionService tokenVersionService,
            TokenBlacklistService tokenBlacklistService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
        this.authUserMapper = authUserMapper;
        this.roleService = roleService;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.tokenVersionService = tokenVersionService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticate(loginRequest);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(authentication, loginRequest.getDeviceId());
        String refreshJwt = generateRefreshTokenAndStoreInRedis(loginRequest, userDetails);
        tokenVersionService.saveTokenVersion(userDetails.getId(), userDetails.getTokenVersion());
        Set<String> roles = exactRoles(userDetails);
        return new JwtResponse(jwt, refreshJwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles);
    }

    public void registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsUserByEmail(signUpRequest.getEmail())) {
            throw new EmailExistException("Email already exists");
        }

        User user = authUserMapper.toEntity(signUpRequest);
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRoles(getDefaultRoles());
        userRepository.save(user);
    }

    public JwtResponse handleAddingNewRoleToUser(RoleUpdateRequest roleUpdateRequest) {
        User userAddingRole = updateUserRoleAndVersion(roleUpdateRequest);
        refreshTokenService.removeAllRefreshToken(userAddingRole.getId());
        String refreshJwt = generateRefreshTokenAndStoreInRedis(userAddingRole.getId(), roleUpdateRequest.getDeviceID());
        JwtResponse jwtResponse = jwtUtils.generateTokenByEmail(userAddingRole.getEmail(), roleUpdateRequest.getDeviceID());
        jwtResponse.setRefreshToken(refreshJwt);
        return jwtResponse;
    }

    public void logoutOne(RefreshTokenRequest refreshTokenRequest, String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String accessToken = authHeader.substring(7); // bỏ "Bearer "
            tokenBlacklistService.blacklistAccessToken(jwtUtils.getJtiFromJwtToken(accessToken), jwtUtils.getJwtExpirationMs(accessToken));
            refreshTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken(), jwtUtils.getIdFromJwtToken(accessToken));
        }
        throw new ApiException("Invalid token", "INVALID_TOKEN", HttpStatus.BAD_REQUEST);
    }


    public JwtResponse refreshAccessToken(RefreshTokenRequest refreshTokenRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
           throw new ApiException("Invalid request", "INVALID_REQUEST", HttpStatus.BAD_REQUEST);
        }
        Map<Object, Object> map = refreshTokenService.getRefreshToken(refreshTokenRequest.getRefreshToken());
        if (map == null) {
           throw new ApiException("Invalid refresh token and refresh token expried", "INVALID_REQUEST", HttpStatus.BAD_REQUEST);
        }
        Long userId = Long.parseLong(map.get("userId").toString());
        String email = userRepository.findUserById(userId).getEmail();
        JwtResponse jwtResponse = jwtUtils.generateTokenByEmail(email, map.get("deviceId").toString());
        jwtResponse.setRefreshToken(refreshTokenRequest.getRefreshToken());
        return jwtResponse;
    }

    private static Set<String> exactRoles(UserDetailsImpl userDetails) {
        return userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toSet());
    }

    private String generateRefreshTokenAndStoreInRedis(LoginRequest loginRequest, UserDetailsImpl userDetails) {
        // sau đó generate token dựa vào authentication
        String refreshJwt = jwtUtils.generateRefreshJwtToken();
        // luu refreshtoken vao redis
        refreshTokenService.saveRefreshToken(refreshJwt, userDetails.getId(), loginRequest.getDeviceId(), 7);
        return refreshJwt;
    }

    private Authentication authenticate(LoginRequest loginRequest) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        //spring security dung DaoAUthenticationProvider de goi UserDetailServiceImpl.loadUserByUserName(email)
        // so sanh paswod và nếu đúng sẽ trả về Authentication chứa UserDetailsImpl và Authories
    }

    private Set<Role> getDefaultRoles() {
        Set<Role> defaultRoles = new HashSet<>();
        defaultRoles.add(roleService.getRole("RENTER"));
        return defaultRoles;
    }

    private String generateRefreshTokenAndStoreInRedis(Long userAddingRole, String roleUpdateRequest) {
        String refreshJwt = jwtUtils.generateRefreshJwtToken();
        refreshTokenService.saveRefreshToken(refreshJwt, userAddingRole, roleUpdateRequest, 7);
        return refreshJwt;
    }

    private User updateUserRoleAndVersion(RoleUpdateRequest roleUpdateRequest) {
        User userAddingRole = userService.addRoleToUser(roleUpdateRequest.getUserId(), roleUpdateRequest.getRole());
        userService.updateUserByIncreasingVersionToken(userAddingRole);
        // update lai cache versionToken
        tokenVersionService.updateTokenVersion(userAddingRole.getId(), userAddingRole.getTokenVersion());
        return userAddingRole;
    }
}
