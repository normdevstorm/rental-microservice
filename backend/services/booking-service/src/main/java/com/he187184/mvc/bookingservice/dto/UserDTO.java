package com.he187184.mvc.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;

    private String email;
    private String password;
    private String name;
    private String phone;
    private String address;

    private String identityCard;
}