package com.he187184.mvc.itemservice.service;

import com.he187184.mvc.itemservice.dto.MotorbikeDTO;
import com.he187184.mvc.itemservice.entity.Car;
import com.he187184.mvc.itemservice.entity.Motorbike;

import java.util.List;

public interface MotorbikeService {
    Motorbike create(MotorbikeDTO motorbikeDTO);
//    List<MotorbikeDTO> getAllMotorbikes();
}
