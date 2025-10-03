package com.he187184.mvc.itemservice.mapper;

import com.he187184.mvc.itemservice.dto.CarDTO;
import com.he187184.mvc.itemservice.dto.MotorbikeDTO;
import com.he187184.mvc.itemservice.entity.Car;
import com.he187184.mvc.itemservice.entity.Motorbike;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface MotorbikeMapper {

    MotorbikeDTO toDTO(Motorbike motorbike);

    Motorbike toEntity(MotorbikeDTO dto);
}
