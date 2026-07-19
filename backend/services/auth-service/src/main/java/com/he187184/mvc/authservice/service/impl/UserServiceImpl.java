package com.he187184.mvc.authservice.service.impl;

import com.he187184.mvc.authservice.dto.response.UserDTO;
import com.he187184.mvc.authservice.entity.Role;
import com.he187184.mvc.authservice.entity.User;
import com.he187184.mvc.authservice.mapper.UserMapper;
import com.he187184.mvc.authservice.repository.RoleRepository;
import com.he187184.mvc.authservice.repository.UserRepository;
import com.he187184.mvc.authservice.service.UserService;
import org.example.commonlib.dto.BaseResponse;
import org.example.commonlib.exception.custom.ApiException;
import org.example.commonlib.security.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;

    public UserServiceImpl (UserRepository userRepository,
                         SecurityUtils securityUtils,
                         UserMapper userMapper,
                         RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
        this.userMapper = userMapper;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserDTO getMe() {
      return getUserByID(securityUtils.getCurrentUserId());
    }

    @Override
    public UserDTO getUserByID(Long id) {
        User user = userRepository.findUserById(id);
        if(user==null){
            throw new ApiException("User not found", "User_NOT_FOUND", HttpStatus.BAD_REQUEST);
        }
        return userMapper.toDTO(user);

    }

    @Override
    public User addRoleToUser(Long userId, String roleName) {
        Role role = roleRepository.findByName(roleName);
        if(role==null){
            throw new ApiException("Role not found", "ROLE_NOT_FOUND", HttpStatus.BAD_REQUEST);
        }
        User user = userRepository.findUserById(userId);
        user.getRoles().add(role);
        return userRepository.save(user);
        }

    @Override
    public UserDTO updateMe(UserDTO userDTO) {
        User user = userRepository.findUserById(securityUtils.getCurrentUserId());
        if(user==null){
            throw new ApiException("User not found", "User_NOT_FOUND", HttpStatus.BAD_REQUEST);
        }
        User updatedUser = userMapper.updateEntityFromDto(userDTO,user);
        return  userMapper.toDTO(userRepository.save(updatedUser));
    }

    @Override
    public User updateUserByIncreasingVersionToken(User user) {
        user.setTokenVersion(user.getTokenVersion()+1);
        return userRepository.save(user);
    }
    @Override
    public boolean isEmailExist(String email){
        if(userRepository.existsUserByEmail(email)) return true;
        else throw new ApiException("Email not exsited","EMAIL_NOT_EXISTED", HttpStatus.BAD_REQUEST);
    }

}
