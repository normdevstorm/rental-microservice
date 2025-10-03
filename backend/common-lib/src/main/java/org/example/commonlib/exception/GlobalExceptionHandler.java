package org.example.commonlib.exception;

import org.example.commonlib.dto.BaseResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse<Object>> handleGenericException(Exception ex) {
        BaseResponse<Object> response = new BaseResponse<>(ex.getMessage(), false, "INTERNAL_ERROR", "Internal server error");
        return ResponseEntity.status(500).body(response);
    }

}
