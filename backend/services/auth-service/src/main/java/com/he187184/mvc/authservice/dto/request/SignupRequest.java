package com.he187184.mvc.authservice.dto.request;

import com.he187184.mvc.authservice.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 100, message = "Mật khẩu phải từ 6 đến 100 ký tự")
    private String password;

    @NotBlank(message = "Tên không được để trống")
    private String name;

    private Boolean isActive = true; // mặc định là true khi đăng ký
    // Nếu muốn cho phép chọn role khi đăng ký
    private Set<String> stringRoles; // ví dụ: ["USER", "OWNER"]

}
