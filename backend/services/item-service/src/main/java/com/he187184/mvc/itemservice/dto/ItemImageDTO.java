package com.he187184.mvc.itemservice.dto;

import com.he187184.mvc.itemservice.constant.ImageType;
import com.he187184.mvc.itemservice.entity.Item;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemImageDTO {
    private Long id;
    private String imageUrl;
    private ImageType imageType;
}
