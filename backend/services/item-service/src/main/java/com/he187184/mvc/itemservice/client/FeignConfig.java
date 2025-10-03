package com.he187184.mvc.itemservice.client;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.stream.Collectors;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor authInterceptor() {
        return requestTemplate -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                requestTemplate.header("X-User-Id", auth.getName());
                String roles = auth.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.joining(","));
                requestTemplate.header("X-User-Roles", roles);
            }
        };
    }
}
