package com.he187184.mvc.authservice.repository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import com.he187184.mvc.authservice.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long > {
    User findUserById(Long id);
    Optional findUserByEmail(String email);
    boolean existsUserByEmail (String email);
    User save(User user);
}
