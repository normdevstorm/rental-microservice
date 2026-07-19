package jmaster.io.gatewayservice.dto;


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
    private int tokenVersion;

    private String identityCard;
}