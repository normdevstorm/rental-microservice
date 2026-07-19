package org.example.commonlib.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) principal).getId();
        }

        throw new RuntimeException("Principal is not of type UserDetailsImpl");
    }
    public boolean hasRoleOwner() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("OWNER"));
    }
    public String getDeviceId(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return String.valueOf(authentication.getDetails());
    }



}


