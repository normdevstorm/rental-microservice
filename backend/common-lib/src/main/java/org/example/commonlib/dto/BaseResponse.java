package org.example.commonlib.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseResponse<T> {
    private boolean success;
    private String message;
    private String code;
    private T data;

    public BaseResponse(String message, boolean success, String code, T data) {
        this.message = message;
        this.success = success;
        this.code = code;
        this.data = data;
    }

    public BaseResponse(ResponseCode responseCode, boolean success, T data) {
        this.success = success;
        this.code = responseCode.getCode();
        this.message = responseCode.getDefaultMessage();
        this.data = data;
    }
}
