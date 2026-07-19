package com.he187184.mvc.authservice.service.impl;

import com.he187184.mvc.authservice.entity.Role;
import com.he187184.mvc.authservice.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class RoleService {
@Autowired
RoleRepository roleRepository;
    public Set<Role> getRoles( Set<String> stringRoles) {

        Set<Role> roles = new HashSet<>();

        if (stringRoles == null || stringRoles.isEmpty()) {
         roles = null;
        } else {
            for (String roleName : stringRoles) {
                Role role = roleRepository.findByName(roleName.toUpperCase());
                roles.add(role);
            }
        }
        return roles;

    }
    public Role getRole(String roleName) {
        Role role = roleRepository.findByName(roleName.toUpperCase());
        return role;
    }
}
