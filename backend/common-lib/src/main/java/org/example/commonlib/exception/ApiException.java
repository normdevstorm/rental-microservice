package org.example.commonlib.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiException extends RuntimeException{

    private String code;
    private  HttpStatus status;

    public ApiException(String message, String code, HttpStatus status) {
        super(message);
        this.code = code;
        this.status = status;
    }


}
