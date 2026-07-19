package org.example.commonlib.exception.custom;

public class UsernameNotFoundException extends RuntimeException{
    public UsernameNotFoundException(String message){
        super(message);
    }
}
