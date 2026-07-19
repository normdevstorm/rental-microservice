package com.he187184.mvc.itemservice.dto;

import com.he187184.mvc.itemservice.constant.Category;
import com.he187184.mvc.itemservice.entity.Item;
import com.he187184.mvc.itemservice.entity.ItemImage;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDTO { // ✅ Khai báo generic ở đây
    private Long id;
    private UserDTO owner;
    @NotBlank(message = "Name cannot be empty")
    private String name;

    private String description;

    @NotBlank(message = "Price cannot be empty")
    private Double price;
    private Double itemValue;
    private Double latePrice;

    @NotBlank(message = "Deposit amount cannot be empty")
    private Double depositAmount;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    private Item.AvailabilityStatus availabilityStatus;

    private Category category;

    private List<ItemImageDTO> itemImages;

    private LocalDateTime createdAt;

    private Object itemDetail; // ✅ Trường generic
}
