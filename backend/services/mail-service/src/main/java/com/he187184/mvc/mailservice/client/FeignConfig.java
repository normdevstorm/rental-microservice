package com.he187184.mvc.mailservice.client;

import feign.RequestInterceptor;
import org.example.commonlib.security.UserDetailsImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.stream.Collectors;

@Configuration
public class FeignConfig {
//
//    @Bean
//    public RequestInterceptor authInterceptor() {
//        return requestTemplate -> {
//            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//            if (auth != null && auth.isAuthenticated()) {
//                Object principal = auth.getPrincipal();
//                if (principal instanceof UserDetailsImpl) {
//                    UserDetailsImpl userDetails = (UserDetailsImpl) principal;
//                    requestTemplate.header("X-User-Id", String.valueOf(userDetails.getId()));
//                } else {
//                    throw new IllegalStateException("Principal is not of type UserDetailsImpl");
//                }
//                String roles = auth.getAuthorities().stream()
//                        .map(GrantedAuthority::getAuthority)
//                        .collect(Collectors.joining(","));
//                requestTemplate.header("X-User-Roles", roles);
//            }
//        };
//    }
}

