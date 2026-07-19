package com.he187184.mvc.itemservice.mapper;

import com.he187184.mvc.itemservice.dto.CarDTO;
import com.he187184.mvc.itemservice.entity.Car;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface CarMapper {

    CarDTO toDTO(Car car);

    Car toEntity(CarDTO dto);
}
