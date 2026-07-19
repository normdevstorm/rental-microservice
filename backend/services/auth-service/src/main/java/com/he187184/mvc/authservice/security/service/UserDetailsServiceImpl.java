package com.he187184.mvc.authservice.security.service;

import com.he187184.mvc.authservice.entity.User;
import com.he187184.mvc.authservice.repository.UserRepository;
import org.example.commonlib.exception.custom.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl( UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        User user = null;
        try {
            user = (User) userRepository.findUserByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + email));
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
        return UserDetailsImpl.build(user);
    }
}
