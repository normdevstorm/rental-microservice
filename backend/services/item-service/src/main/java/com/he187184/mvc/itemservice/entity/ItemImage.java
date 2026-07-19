
package com.he187184.mvc.itemservice.entity;



import com.he187184.mvc.itemservice.constant.ImageType;
//import com.he187184.mvc.paymentservice.constant.ImageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "item_images")
public class ItemImage {
    @Id
    @GeneratedValue
    private Long id;
    private String imageUrl;
//    @Enumerated(EnumType.STRING)
    private ImageType imageType;
    @ManyToOne
    private Item item;
}
