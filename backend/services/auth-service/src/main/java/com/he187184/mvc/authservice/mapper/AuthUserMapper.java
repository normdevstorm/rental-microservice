package com.he187184.mvc.authservice.mapper;


import com.he187184.mvc.authservice.dto.request.SignupRequest;

import org.mapstruct.Mapper;
import com.he187184.mvc.authservice.entity.User;

@Mapper(componentModel = "spring")
public interface AuthUserMapper {

    SignupRequest toDTO(User user);

    User toEntity(SignupRequest dto);
}
