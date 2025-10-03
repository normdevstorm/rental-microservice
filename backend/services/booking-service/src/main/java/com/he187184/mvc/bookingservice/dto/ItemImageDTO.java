package com.he187184.mvc.bookingservice.dto;

import com.he187184.mvc.bookingservice.constant.ImageType;
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
