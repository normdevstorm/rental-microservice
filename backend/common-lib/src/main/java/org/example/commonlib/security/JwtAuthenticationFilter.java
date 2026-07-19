package org.example.commonlib.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private  JwtService jwtService;
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws IOException, ServletException {
        String id = request.getHeader("X-User-Id");
        String roles = request.getHeader("X-User-Roles");
        String deviceId = request.getHeader("X-Device-Id");
        if (hasValidHeader(id, roles)) {
            Collection<GrantedAuthority> authorities = getGrantedAuthorities(roles);
            UsernamePasswordAuthenticationToken authentication = buildAuthentication(id, authorities, deviceId);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private static UsernamePasswordAuthenticationToken buildAuthentication(String id, Collection<GrantedAuthority> authorities, String deviceId) {
        UserDetailsImpl userDetails = new UserDetailsImpl(Long.valueOf(id), authorities);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(deviceId);
        return authentication;
    }

    private static Collection<GrantedAuthority> getGrantedAuthorities(String roles) {
        String[] rolesArray = roles.split(",");
        Collection<GrantedAuthority> authorities = Arrays.stream(rolesArray).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
        return authorities;
    }

    private static boolean hasValidHeader(String id, String roles) {
        return id != null && roles != null;
    }


}









// ==========Before refactoring code

//package org.example.commonlib.security;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.util.StringUtils;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//import java.util.Arrays;
//import java.util.Collection;
//import java.util.stream.Collectors;
//
//@Component
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//    @Autowired
//    private  JwtService jwtService;
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain) throws IOException, ServletException {
//        String id = request.getHeader("X-User-Id");
//        String roles = request.getHeader("X-User-Roles");
//        String deviceId = request.getHeader("X-Device-Id");
//
//        if (id != null && roles != null) {
//            String[] rolesArray = roles.split(",");
//            Collection<GrantedAuthority> authorities = Arrays.stream(rolesArray).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
//            UserDetailsImpl userDetails = new UserDetailsImpl(Long.valueOf(id), authorities);
//            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//            authentication.setDetails(deviceId);
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//        }
//        filterChain.doFilter(request, response);
//    }
//
//}


