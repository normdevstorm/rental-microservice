package com.he187184.mvc.mailservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private String phone;
    private String address;
    private String identityCard;
}
