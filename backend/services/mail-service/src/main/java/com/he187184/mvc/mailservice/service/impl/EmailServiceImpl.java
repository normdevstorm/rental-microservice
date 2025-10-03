package com.he187184.mvc.mailservice.service.impl;

import com.he187184.mvc.mailservice.client.AuthService;
import com.he187184.mvc.mailservice.constant.Constant;
import com.he187184.mvc.mailservice.entity.EmailVerification;
import com.he187184.mvc.mailservice.exception.handler.EmailException;
import com.he187184.mvc.mailservice.repository.EmailVerificationRepository;
import com.he187184.mvc.mailservice.service.EmailService;
import com.he187184.mvc.mailservice.utils.Helper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Component
@Service
public class EmailServiceImpl implements EmailService {

    private JavaMailSender emailSender;
    private EmailVerificationRepository emailVerificationRepository;
    private AuthService authService;

    @Autowired
    public EmailServiceImpl(JavaMailSender emailSender, EmailVerificationRepository emailVerificationRepository, AuthService authService){
        this.emailSender = emailSender;
        this.emailVerificationRepository = emailVerificationRepository;
        this.authService =  authService;
    }

    @Value("${spring.mail.host}")
    private String host;

    private String generateCode(String email) {
        String input = email + Instant.now().toEpochMilli() + new Random().nextInt(1000);

        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(input.getBytes());

            // Take first 6 digits from the hash
            int code = Math.abs(java.util.Arrays.hashCode(hash)) % 1000000;
            return String.format("%06d", code);
        } catch (Exception e) {
            // Fallback to random if hashing fails
            return String.format("%06d", new Random().nextInt(1000000));
        }
    }


    @Transactional
    @Override
    public void sendVerificationCode(
            String to) {
        try {

            // check if user already singed up, which should throw an error
             BaseResponse<Boolean> response = authService.checkEmailExists(to);
                if(response != null && response.getData() != null && (Boolean) response.getData()){
                    throw new EmailException("Email already exists", HttpStatus.BAD_REQUEST.value());
                }

            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(String.format(Constant.EMAIL_FROM, host));
            helper.setTo(to);
            helper.setSubject(Constant.EMAIL_VERIFICATION_SUBJECT);

            String expirationTimeInfo = Helper.convertFromLongToMinute(Constant.expirationTime) + " minutes";
            String verificationCode = generateCode(to);
            LocalDateTime expiredAt = LocalDateTime.now().plus(Constant.expirationTime, ChronoUnit.MILLIS);

            boolean exists = checkIfExist(to);
            EmailVerification emailVerification;
            if(exists){
                emailVerification = emailVerificationRepository.findEmailVerificationByEmail(to);
                emailVerification.setVerificationCode(verificationCode);
                emailVerification.setExpiredAt(expiredAt);
            } else {
                emailVerification = EmailVerification.builder().expiredAt(expiredAt).email(to).verificationCode(verificationCode).build();
            }
            emailVerificationRepository.save(emailVerification);
            String content = String.format(Constant.HTML_TEMPLATE, verificationCode, expirationTimeInfo) ;
            helper.setText(content, true);
            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e.getMessage());
        } catch (EmailException e) {
            throw e;
        }
        catch (Exception e) {
            throw new EmailException(e.getMessage(),  HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    private boolean checkIfExist(String to) {
        return emailVerificationRepository.existsEmailVerificationByEmail(to);
    }

    @Override
    public boolean verifyCode(String email, String code) {
        boolean exist = checkIfExist(email);
        if(!exist){
            throw new EmailException("Email not found", HttpStatus.NOT_FOUND.value());
        }

        EmailVerification storedEmailVerificationCode = emailVerificationRepository.findEmailVerificationByEmail(email);
        if(storedEmailVerificationCode.getVerificationCode().isBlank()) {
            throw new EmailException("No verification code found for this email", HttpStatus.NOT_FOUND.value());
        }

        if(!storedEmailVerificationCode.getVerificationCode().equals(code)) {
            throw new EmailException("Invalid verification code", HttpStatus.BAD_REQUEST.value());
        }

        if(storedEmailVerificationCode.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new EmailException("Verification code has expired", HttpStatus.BAD_REQUEST.value());
        }
        return true;
    }


}