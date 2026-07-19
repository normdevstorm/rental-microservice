
package com.he187184.mvc.itemservice.entity;


import com.he187184.mvc.itemservice.constant.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "items")

public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ownerId; // Không dùng @ManyToOne (vì khác DB)

    private String name;
    private String description;

    private Double price;
    private Double latePrice;
    private Double depositAmount;
    private String address;
    @Enumerated(EnumType.STRING)
    private Category category;
    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availabilityStatus;
    private Double itemValue;
    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum AvailabilityStatus {
        AVAILABLE,
        UNAVAILABLE,
        MAINTENANCE
    }

}

