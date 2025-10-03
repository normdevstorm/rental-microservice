package com.he187184.mvc.itemservice.dto;

import com.he187184.mvc.itemservice.constant.FuelType;
import com.he187184.mvc.itemservice.constant.Transmission;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MotorbikeDTO {
    private Long id;
    private String brand;
    private String model;
    private Integer year;
    @Enumerated(EnumType.STRING)
    private Transmission transmission;
    @Enumerated(EnumType.STRING)
    private FuelType fuelType;
    private Integer kms;
    private Integer engineCapacity;
    private String licensePlate;
    private ItemDTO item;
    private List<ItemImageDTO> itemImages;
}
