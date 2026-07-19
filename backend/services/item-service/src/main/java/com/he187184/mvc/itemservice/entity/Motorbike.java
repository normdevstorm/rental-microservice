package com.he187184.mvc.itemservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.he187184.mvc.itemservice.constant.FuelType;
import com.he187184.mvc.itemservice.constant.Transmission;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "motorbikes")
public class Motorbike {
    @Id
    private Long id;

    @JsonIgnore
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Item item;

    private String brand;
    private String model;
    private Integer year;
    private Integer engineCapacity;

    @Enumerated(EnumType.STRING)
    private Transmission transmission;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;
    private Integer kms;
    private String licensePlate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public Integer getKms() {
        return kms;
    }

    public void setKms(Integer kms) {
        this.kms = kms;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public Transmission getTransmission() {
        return transmission;
    }

    public void setTransmission(Transmission transmission) {
        this.transmission = transmission;
    }

    public Integer getEngineCapacity() {
        return engineCapacity;
    }

    public void setEngineCapacity(Integer engineCapacity) {
        this.engineCapacity = engineCapacity;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setItem(Item item) {
        this.item = item;
    }
}
