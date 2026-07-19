package com.he187184.mvc.mailservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableFeignClients
@ComponentScan(basePackages = {
        "com.he187184.mvc.mailservice",
        "org.example.commonlib.security"
})

public class MailServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MailServiceApplication.class, args);
    }

}
