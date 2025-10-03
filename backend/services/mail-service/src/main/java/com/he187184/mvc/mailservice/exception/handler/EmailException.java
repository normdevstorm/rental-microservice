package com.he187184.mvc.mailservice.exception.handler;

import lombok.Getter;

@Getter
public class EmailException extends RuntimeException {
    private int code;
    public EmailException(String message, int code) {
        super(message);
        this.code = code;
    }
}
