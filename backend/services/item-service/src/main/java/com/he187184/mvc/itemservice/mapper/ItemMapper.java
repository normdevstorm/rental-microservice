package com.he187184.mvc.itemservice.mapper;

import com.he187184.mvc.itemservice.dto.ItemDTO;
import com.he187184.mvc.itemservice.entity.Item;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ItemMapper {

    ItemDTO toDTO(Item item);

    Item toEntity(ItemDTO itemDTO);
}
