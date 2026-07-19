package com.he187184.mvc.mailservice.repository;

import com.he187184.mvc.mailservice.entity.EmailVerification;
import jakarta.validation.constraints.Email;
import org.antlr.v4.runtime.misc.MultiMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Integer> {
    boolean existsEmailVerificationByEmail(@Email String email);

    EmailVerification findEmailVerificationByEmail(@Email String email);
}
