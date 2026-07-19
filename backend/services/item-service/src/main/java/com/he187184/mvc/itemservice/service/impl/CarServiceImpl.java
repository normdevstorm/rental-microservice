package com.he187184.mvc.itemservice.service.impl;

import com.he187184.mvc.itemservice.constant.Category;
import com.he187184.mvc.itemservice.dto.CarDTO;
import com.he187184.mvc.itemservice.dto.ItemImageDTO;
import com.he187184.mvc.itemservice.dto.MotorbikeDTO;
import com.he187184.mvc.itemservice.entity.Car;
import com.he187184.mvc.itemservice.entity.Item;
import com.he187184.mvc.itemservice.entity.ItemImage;
import com.he187184.mvc.itemservice.entity.Motorbike;
import com.he187184.mvc.itemservice.mapper.CarMapper;
import com.he187184.mvc.itemservice.mapper.ItemMapper;
import com.he187184.mvc.itemservice.mapper.MotorbikeMapper;
import com.he187184.mvc.itemservice.repository.CarRepository;
import com.he187184.mvc.itemservice.repository.MotorbikeRepository;
import com.he187184.mvc.itemservice.service.CarService;
import com.he187184.mvc.itemservice.service.ItemImageService;
import com.he187184.mvc.itemservice.service.ItemService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CarServiceImpl implements CarService {
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private ItemService itemService;
    @Autowired
    private ItemImageService itemImageService;
    @Autowired
    private CarMapper carMapper;
    @Autowired
    private ItemMapper itemMapper;

    @Override
    @Transactional
    public Car create(CarDTO carDTO) {
        Item item = itemService.createItem(carDTO.getItem());

        List<ItemImage> itemImageList = itemImageService.createItemImages(carDTO.getItemImages(), item);
        Car car = carMapper.toEntity(carDTO);
        car.setItem(item);
        return carRepository.save(car);
    }



}
