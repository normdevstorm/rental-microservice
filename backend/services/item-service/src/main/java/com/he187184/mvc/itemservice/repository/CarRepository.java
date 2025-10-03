package com.he187184.mvc.itemservice.repository;

import com.he187184.mvc.itemservice.entity.Car;
import com.he187184.mvc.itemservice.entity.Motorbike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepository extends JpaRepository<Car, Integer> {
    Car findCarById(Long id);
}
