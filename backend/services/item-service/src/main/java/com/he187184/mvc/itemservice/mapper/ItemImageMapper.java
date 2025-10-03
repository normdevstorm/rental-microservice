package com.he187184.mvc.itemservice.mapper;

import com.he187184.mvc.itemservice.dto.CarDTO;
import com.he187184.mvc.itemservice.dto.ItemImageDTO;
import com.he187184.mvc.itemservice.entity.Car;
import com.he187184.mvc.itemservice.entity.ItemImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface ItemImageMapper {

    ItemImageDTO toDTO(ItemImage itemImage);

    ItemImage toEntity(ItemImageDTO dto);
}
