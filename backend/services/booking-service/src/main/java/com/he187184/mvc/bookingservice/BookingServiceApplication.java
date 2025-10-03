package com.he187184.mvc.bookingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@ComponentScan(basePackages = {
        "com.he187184.mvc",
        "org.example.commonlib.security" // ✅ để Spring quét JwtAuthenticationFilter
})
@EnableMethodSecurity
@EnableFeignClients
@EnableDiscoveryClient
@SpringBootApplication
public class BookingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookingServiceApplication.class, args);
    }

}
