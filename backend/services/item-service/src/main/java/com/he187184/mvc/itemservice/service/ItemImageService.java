package com.he187184.mvc.itemservice.service;

import com.he187184.mvc.itemservice.dto.ItemImageDTO;
import com.he187184.mvc.itemservice.entity.Item;
import com.he187184.mvc.itemservice.entity.ItemImage;

import java.util.List;

public interface ItemImageService {
    public ItemImage createItemImage  (ItemImageDTO itemImageDTO, Item item);
    public List<ItemImage> createItemImages(List<ItemImageDTO> itemImageDTOList, Item item);
    public List<ItemImageDTO> mapItemImagesListToItemImageDTOList(List<ItemImage> itemImageList);
    public List<ItemImage> getItemImagesByItem(Item item);
}
