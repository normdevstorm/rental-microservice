package com.he187184.mvc.authservice.controller;

import com.he187184.mvc.authservice.dto.response.UserDTO;
import com.he187184.mvc.authservice.entity.User;
import com.he187184.mvc.authservice.mapper.UserMapper;
import com.he187184.mvc.authservice.service.UserService;
import org.example.commonlib.dto.BaseResponse;
import org.example.commonlib.dto.ResponseCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping("/me")
    public ResponseEntity<BaseResponse<UserDTO>> getMe() {
        UserDTO userDTO = userService.getMe();
        return ResponseEntity.ok(new BaseResponse<>("Get me successfully", true, "SUCCESS", userDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserByID(id);
        return ResponseEntity.ok(new BaseResponse<>("Get user successfully", true, "SUCCESS", userDTO));
    }

    @PatchMapping("/me")
    public ResponseEntity<BaseResponse<UserDTO>> updateMe(@RequestBody UserDTO userDTO) {
        UserDTO dto = userService.updateMe(userDTO);
        return ResponseEntity.ok(new BaseResponse<>("Update me successfully", true, "SUCCESS", dto));
    }


}
