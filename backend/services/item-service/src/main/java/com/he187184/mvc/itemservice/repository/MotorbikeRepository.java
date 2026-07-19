package com.he187184.mvc.itemservice.repository;

import com.he187184.mvc.itemservice.entity.Motorbike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MotorbikeRepository extends JpaRepository<Motorbike, Long> {
    Motorbike findMotorbikeById(Long id);
}
