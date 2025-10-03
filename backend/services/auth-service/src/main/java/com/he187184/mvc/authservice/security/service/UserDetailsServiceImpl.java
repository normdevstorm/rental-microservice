package com.he187184.mvc.authservice.security.service;




import com.he187184.mvc.authservice.entity.User;
import com.he187184.mvc.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
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
