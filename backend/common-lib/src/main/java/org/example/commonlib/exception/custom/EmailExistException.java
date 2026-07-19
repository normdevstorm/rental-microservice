package org.example.commonlib.exception.custom;

public class EmailExistException extends RuntimeException{
    public EmailExistException(String message) {
        super(message);
    }
}
