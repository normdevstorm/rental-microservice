package com.he187184.mvc.authservice.service;

import com.he187184.mvc.authservice.dto.request.RoleUpdateRequest;
import com.he187184.mvc.authservice.dto.response.UserDTO;
import com.he187184.mvc.authservice.entity.Role;
import com.he187184.mvc.authservice.entity.User;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;

public interface UserService {
    public UserDTO getMe();

    public UserDTO getUserByID(Long id);

    public User addRoleToUser(Long userId, String role);

    public UserDTO updateMe(UserDTO userDTO);

    public User updateUserByIncreasingVersionToken(User user);

    public boolean isEmailExist(String email);

}
