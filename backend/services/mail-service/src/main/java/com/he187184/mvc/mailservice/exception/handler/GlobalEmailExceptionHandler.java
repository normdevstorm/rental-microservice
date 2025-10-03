package com.he187184.mvc.mailservice.exception.handler;

import org.example.commonlib.dto.BaseResponse;
import org.example.commonlib.exception.ApiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalEmailExceptionHandler {
    @ExceptionHandler(EmailException.class)
    public ResponseEntity<BaseResponse> handleException(EmailException emailException){
        BaseResponse<Object> response = new BaseResponse<>(emailException.getMessage(), false, String.valueOf(emailException.getCode()), null);
        return ResponseEntity.badRequest().body(response);

    }
}
