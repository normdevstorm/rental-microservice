package com.he187184.mvc.itemservice.service.impl;

import com.he187184.mvc.itemservice.dto.ItemImageDTO;
import com.he187184.mvc.itemservice.entity.Item;
import com.he187184.mvc.itemservice.entity.ItemImage;
import com.he187184.mvc.itemservice.mapper.ItemImageMapper;
import com.he187184.mvc.itemservice.repository.ItemImageRepository;
import com.he187184.mvc.itemservice.service.ItemImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ItemImageServiceImpl implements ItemImageService {
@Autowired
private ItemImageRepository itemImageRepository;
@Autowired
ItemImageMapper itemImageMapper;

    @Override
    public ItemImage createItemImage(ItemImageDTO itemImageDTO, Item item ) {
        ItemImage itemImage = itemImageMapper.toEntity(itemImageDTO);
        itemImage.setItem(item);
        return itemImageRepository.save(itemImage);
    }

    @Override
    public List<ItemImage> createItemImages(List<ItemImageDTO> itemImageDTOList, Item item) {
        List<ItemImage> itemImageList = new ArrayList<>();
        for (ItemImageDTO itemImageDTO : itemImageDTOList) {
           itemImageList.add(createItemImage(itemImageDTO, item));
        }
        return itemImageList;
     }

    @Override
    public List<ItemImageDTO> mapItemImagesListToItemImageDTOList(List<ItemImage> itemImageList) {
        List<ItemImageDTO> itemImageDTOList = new ArrayList<>();
        for (ItemImage itemImage : itemImageList) {
            itemImageDTOList.add(itemImageMapper.toDTO(itemImage));
        }
        return itemImageDTOList;
    }

    @Override
    public List<ItemImage> getItemImagesByItem(Item item) {
        return itemImageRepository.getItemImageByItem(item);
    }
}
