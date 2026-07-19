package org.example.commonlib.exception.custom;

public class BadCredentialsException extends RuntimeException{
    public BadCredentialsException(String message){
        super(message);
    }

}
