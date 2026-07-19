package com.he187184.mvc.mailservice.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    void sendVerificationCode(
            String to);

    boolean verifyCode(String email, String code);
}
