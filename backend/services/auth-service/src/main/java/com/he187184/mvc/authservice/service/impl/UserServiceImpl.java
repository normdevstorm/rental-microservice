package com.he187184.mvc.authservice.service.impl;

import com.he187184.mvc.authservice.dto.response.UserDTO;
import com.he187184.mvc.authservice.entity.Role;
import com.he187184.mvc.authservice.entity.User;
import com.he187184.mvc.authservice.mapper.UserMapper;
import com.he187184.mvc.authservice.repository.RoleRepository;
import com.he187184.mvc.authservice.repository.UserRepository;
import com.he187184.mvc.authservice.service.UserService;
import org.example.commonlib.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    SecurityUtils securityUtils;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public UserDTO getMe() {
        User user = userRepository.findUserById(securityUtils.getCurrentUserId());
        if(user==null){
            return null;
        }
        UserDTO userDTO = userMapper.toDTO(user);
        return userDTO;
    }

    @Override
    public UserDTO getUserByID(Long id) {
        User user = userRepository.findUserById(id);
        if(user==null){
            return null;
        }
        UserDTO userDTO = userMapper.toDTO(user);
        return userDTO;
    }

    @Override
    public User addRoleToUser(Long userId, String roleName) {
        Role role = roleRepository.findByName(roleName);
        if(role==null){
            return null;
        }
        User user = userRepository.findUserById(userId);
        if(user==null){
            return  null;
        }
        user.getRoles().add(role);
        return userRepository.save(user);
        }

    @Override
    public UserDTO updateMe(UserDTO userDTO) {
        User user = userRepository.findUserById(securityUtils.getCurrentUserId());
        if(user==null){
            return null;
        }
        User updatedUser = userMapper.updateEntityFromDto(userDTO,user);
        return  userMapper.toDTO(userRepository.save(updatedUser));
    }

    @Override
    public User updateUserByIncreasingVersionToken(User user) {
        user.setTokenVersion(user.getTokenVersion()+1);
        return userRepository.save(user);

    }

}
