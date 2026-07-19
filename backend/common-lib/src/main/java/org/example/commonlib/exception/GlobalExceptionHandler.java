package org.example.commonlib.exception;

import org.example.commonlib.dto.BaseResponse;
import org.example.commonlib.dto.ResponseCode;
import org.example.commonlib.exception.custom.ApiException;
import org.example.commonlib.exception.custom.EmailExistException;
import org.example.commonlib.exception.custom.UsernameNotFoundException;
import org.example.commonlib.exception.custom.BadCredentialsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<BaseResponse> handleException(ApiException apiException){
        BaseResponse<Object> response = new BaseResponse<>(apiException.getMessage(), false, apiException.getCode(), null);
        return ResponseEntity.badRequest().body(response);

    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));

        BaseResponse<Object> response = new BaseResponse<>(ex.getMessage(), false, "VALIDATION_ERROR",errors);
        return ResponseEntity.badRequest().body(response);
    }
    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<BaseResponse<Object>> handleAuthException(Exception ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new BaseResponse<>("Login failed", false, "Login failed", null));
    }
    @ExceptionHandler(EmailExistException.class)
    public ResponseEntity<BaseResponse<Object>> handleEmailExistException(EmailExistException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(ex.getMessage(), false, "EMAIL_EXIST", null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse<Object>> handleGenericException(Exception ex) {
        BaseResponse<Object> response = new BaseResponse<>(ex.getMessage(), false, "INTERNAL_ERROR", "Internal server error");
        return ResponseEntity.status(500).body(response);
    }

}
