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
import com.he187184.mvc.authservice.service.RoleService;
import com.he187184.mvc.authservice.service.UserService;
import jakarta.validation.Valid;
import org.example.commonlib.dto.BaseResponse;
import org.example.commonlib.dto.ResponseCode;
import org.example.commonlib.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.token.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RequestMapping("/")
@RestController
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

   @Autowired
   JwtUtils jwtUtils;

    @Autowired
    SecurityUtils securityUtils;

    @Autowired
    private AuthUserMapper authUserMapper;
    @Autowired
    private RoleService roleService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserMapper userMapper;
    @Autowired
RefreshTokenService refreshTokenService;
    @Autowired
    TokenVersionService tokenVersionService;
    @Autowired
    TokenBlacklistService tokenBlacklistService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        //spring security dung DaoAUthenticationProvider de goi UserDetailServiceImpl.loadUserByUserName(email)
        // so sanh paswod và nếu đúng sẽ trả về Authentication chứa UserDetailsImpl và Authories


        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // Lưu thông tin ở authentication vào securitycontext
        String jwt = jwtUtils.generateJwtToken(authentication,loginRequest.getDeviceId());
        // sau đó generate token dựa vào authentication
        String refreshJwt = jwtUtils.generateRefreshJwtToken();
        // luu refreshtoken vao redis
       refreshTokenService.saveRefreshToken(refreshJwt,userDetails.getId(),loginRequest.getDeviceId(),7);
       // them versionToken vao redis
        tokenVersionService.saveTokenVersion(userDetails.getId(),userDetails.getTokenVersion());

        Set<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toSet());
        BaseResponse<JwtResponse> response = new BaseResponse<>(ResponseCode.SUCCESS,true, new JwtResponse(jwt, refreshJwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

        if (userRepository.existsUserByEmail(signUpRequest.getEmail())){
            return ResponseEntity
                    .badRequest()
                    .body(new BaseResponse<>(ResponseCode.EMAIL_EXISTS,false, null));
        }

            User user = authUserMapper.toEntity(signUpRequest);
            user.setPassword(encoder.encode(signUpRequest.getPassword()));

// Gán role mặc định là RENTER
        Set<Role> defaultRoles = new HashSet<>();
        defaultRoles.add(roleService.getRole("RENTER"));
        user.setRoles(defaultRoles);
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new BaseResponse<>(ResponseCode.SUCCESS,true, new MessageResponse("User registered successfully!")));
    }
    @PostMapping("/refresh-role")
    public ResponseEntity<?> refreshTokenAfterAddingRole(@Valid @RequestBody RoleUpdateRequest roleUpdateRequest) {


      // tang version trong db
        User userAddingRole = userService.addRoleToUser(roleUpdateRequest.getUserId(), roleUpdateRequest.getRole());
        userService.updateUserByIncreasingVersionToken(userAddingRole);
        // update lai cache versionToken
        tokenVersionService.updateTokenVersion(userAddingRole.getId(), userAddingRole.getTokenVersion());
        // xoa het refresh token
        refreshTokenService.removeAllRefreshToken(userAddingRole.getId());
        // generate accessToken va refreshtoken cho thiet bi dang dang nhap
        JwtResponse jwtResponse = jwtUtils.generateTokenByEmail(userAddingRole.getEmail(),roleUpdateRequest.getDeviceID());
        String refreshJwt = jwtUtils.generateRefreshJwtToken();
        jwtResponse.setRefreshToken(refreshJwt);
        // luu refreshToken vao redis
        refreshTokenService.saveRefreshToken(refreshJwt,userAddingRole.getId(),roleUpdateRequest.getDeviceID(),7);
        BaseResponse response = new BaseResponse<>("Refresh Token succesfully",true,"200", jwtResponse);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/logoutone")
    public ResponseEntity<?> logout(
            @RequestBody RefreshTokenRequest refreshTokenRequest,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        // authHeader = "Bearer <accessToken>"
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String accessToken = authHeader.substring(7); // bỏ "Bearer "
            // Thêm vào blacklist
            tokenBlacklistService.blacklistAccessToken(jwtUtils.getJtiFromJwtToken(accessToken), jwtUtils.getJwtExpirationMs(accessToken));
            // xoa refresh token
            refreshTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken(),jwtUtils.getIdFromJwtToken(accessToken));
            BaseResponse response = new BaseResponse<>("Delete refresh token and revoke access token  succesfully",true,"200", null);
            return ResponseEntity.ok(response);
        }
        BaseResponse response = new BaseResponse<>("Cannot log out",false,"500", null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {

            BaseResponse<?> response = new BaseResponse<>("Invalid request", false, "500", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        }
        // check refresh token
        Map<Object,Object> map = refreshTokenService.getRefreshToken(refreshTokenRequest.getRefreshToken()) ;

        if(map!= null && map.get("deviceId") != null && map.get("deviceId").toString().equals(refreshTokenRequest.getDeviceId())){
           Long userId = Long.parseLong(map.get("userId").toString());
            String email = userRepository.findUserById(userId).getEmail();
           JwtResponse jwtResponse = jwtUtils.generateTokenByEmail(email,map.get("deviceId").toString());
            BaseResponse response = new BaseResponse<>("Refresh Token succesfully",true,"200", jwtResponse);
           jwtResponse.setRefreshToken(refreshTokenRequest.getRefreshToken());
           return ResponseEntity.ok(response);

        }

            BaseResponse<?> response = new BaseResponse<>("Invalid refreshToken or token expried ", false, "500", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

    }

    @PostMapping("/check-exists")
    public ResponseEntity<BaseResponse<Boolean>> checkEmailExists(@RequestParam String email) {
        boolean exists = userRepository.existsUserByEmail(email);
        BaseResponse<Boolean> response = new BaseResponse<>("Check email exists successfully", true, "200", exists);
        return ResponseEntity.ok(response);
    }


}
