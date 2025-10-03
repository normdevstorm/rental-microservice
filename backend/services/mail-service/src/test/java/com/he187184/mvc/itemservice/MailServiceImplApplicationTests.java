package com.he187184.mvc.itemservice;
import com.he187184.mvc.mailservice.MailServiceApplication;
import com.he187184.mvc.mailservice.client.AuthService;
import com.he187184.mvc.mailservice.config.EmailServerConfig;
import com.he187184.mvc.mailservice.constant.Constant;
import com.he187184.mvc.mailservice.repository.EmailVerificationRepository;
import com.he187184.mvc.mailservice.service.EmailService;
import com.he187184.mvc.mailservice.service.impl.EmailServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

//@ContextConfiguration(classes = {EmailServiceImpl.class, EmailServerConfig.class, AuthService.class, EmailVerificationRepository.class})
@SpringBootTest(classes = MailServiceApplication.class)
class MailServiceImplApplicationTests {

    @Autowired(required = true)
    private EmailService emailService;

    @Autowired(required = true)
    private EmailVerificationRepository emailVerificationRepository;



    @Test
    void contextLoads() {
    }

    @Test
    void testEmail(){
        emailService.sendVerificationCode("ssfylayf@gmail.com");
    }

}
