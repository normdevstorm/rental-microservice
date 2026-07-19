package com.he187184.mvc.itemservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.he187184.mvc.itemservice.constant.FuelType;
import com.he187184.mvc.itemservice.constant.Transmission;
import com.he187184.mvc.itemservice.entity.Item;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cars")
public class Car {
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

    @Enumerated(EnumType.STRING)
    private Transmission transmission;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    private Integer seats;
    private String licensePlate;
    private Integer kms;

    public void setItem(Item item) {
        this.item = item;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Transmission getTransmission() {
        return transmission;
    }

    public void setTransmission(Transmission transmission) {
        this.transmission = transmission;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
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
}
