package com.he187184.mvc.authservice.repository;

import com.he187184.mvc.authservice.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Role findByName(String name);
}
