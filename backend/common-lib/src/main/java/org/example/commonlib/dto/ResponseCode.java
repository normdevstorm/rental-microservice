package org.example.commonlib.dto;

public enum ResponseCode {
    SUCCESS("200", "Thành công"),
    EMAIL_EXISTS("EMAIL_EXISTS", "Email đã tồn tại"),
    INVALID_PHONE("INVALID_PHONE", "Số điện thoại không hợp lệ"),
    USER_NOT_FOUND("USER_NOT_FOUND", "Không tìm thấy người dùng"),
    INTERNAL_ERROR("INTERNAL_ERROR", "Lỗi hệ thống"),
    ROLE_NOT_FOUND("ROLE_NOT_FOUND", "Không tìm thấy role");

    private final String code;
    private final String defaultMessage;

    ResponseCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public String getCode() {
        return code;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}
