package com.he187184.mvc.itemservice.dto;

import com.he187184.mvc.itemservice.entity.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateItemRequest {
    Long itemId;
    Item.AvailabilityStatus availabilityStatus;
}
