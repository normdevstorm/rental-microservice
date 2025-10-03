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
    @Autowired
    UserService userService;
    @Autowired
    private UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(){
        UserDTO userDTO = userService.getMe();
        if(userDTO==null){
            return ResponseEntity
                    .badRequest()
                    .body(new BaseResponse<>(ResponseCode.USER_NOT_FOUND,false, null));
        }
        BaseResponse baseResponse = new BaseResponse<>("Get me successfully", true,"SUCCESS",userDTO);
        return ResponseEntity.ok(baseResponse);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id){
        UserDTO userDTO = userService.getUserByID(id);
        if(userDTO==null){
            return ResponseEntity
                    .badRequest()
                    .body(new BaseResponse<>(ResponseCode.USER_NOT_FOUND,false, null));
        }
        BaseResponse baseResponse = new BaseResponse<>("Get me successfully", true,"SUCCESS",userDTO);
        return ResponseEntity.ok(baseResponse);
    }
    @PatchMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody UserDTO userDTO){
        UserDTO dto = userService.updateMe(userDTO);
        BaseResponse baseResponse = new BaseResponse<>("Get me successfully", true,"SUCCESS",dto);
        return ResponseEntity.ok(baseResponse);
    }

}
