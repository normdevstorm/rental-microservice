package com.he187184.mvc.itemservice.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoleUpdateRequest {
    private Long userId;
private    String role;
    private String deviceID;

}
