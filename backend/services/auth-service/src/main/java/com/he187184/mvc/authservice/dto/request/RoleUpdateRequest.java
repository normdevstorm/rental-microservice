package com.he187184.mvc.authservice.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoleUpdateRequest {

    @NotNull(message = "userId must not be null")
    private Long userId;

    @NotEmpty(message = "role must not be empty")
    private String role;

    @NotEmpty()
    private String deviceID;

}
