package com.he187184.mvc.itemservice.repository;

import com.he187184.mvc.itemservice.entity.Item;
import com.he187184.mvc.itemservice.entity.ItemImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemImageRepository extends JpaRepository<ItemImage, Long> {
    List<ItemImage> getItemImageByItem(Item item);

    List<ItemImage> findItemImageByItem_Id(Long itemId);
}
