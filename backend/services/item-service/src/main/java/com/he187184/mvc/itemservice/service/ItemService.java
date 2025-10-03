package com.he187184.mvc.itemservice.service;

import com.he187184.mvc.itemservice.constant.Category;
import com.he187184.mvc.itemservice.dto.ItemDTO;
import com.he187184.mvc.itemservice.dto.UpdateItemRequest;
import com.he187184.mvc.itemservice.entity.Item;

import java.time.LocalDateTime;
import java.util.List;

public interface ItemService  {
    public Item createItem (ItemDTO itemDTO);


    ItemDTO updateItemStatus(UpdateItemRequest request);

    public List<ItemDTO> getAllItemsByCategory(Category category);
    public ItemDTO getItemDTOById(Long id);
    public List<ItemDTO> getAllMyItems();
    public List<ItemDTO> filterItemsByCategoryAddressAndDate(String address, Category category, LocalDateTime startDate, LocalDateTime endDate);

}
