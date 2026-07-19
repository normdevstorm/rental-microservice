package com.he187184.mvc.itemservice.service.impl;

//import com.he187184.mvc.itemservice.dto.MotorbikeDTO;
import com.he187184.mvc.itemservice.constant.Category;
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
import com.he187184.mvc.itemservice.service.ItemImageService;
import com.he187184.mvc.itemservice.service.ItemService;
import com.he187184.mvc.itemservice.service.MotorbikeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.List;

@Service
public class MotorbikeServiceImpl implements MotorbikeService {

    @Autowired
    private ItemService itemService;
    @Autowired
    private ItemImageService itemImageService;
    @Autowired
    private MotorbikeMapper motorbikeMapper;
    @Autowired
    private MotorbikeRepository motorbikeRepository;
    @Autowired
    private ItemMapper itemMapper;


//    private List<MotorbikeDTO> mapMotorbikeListToMotorbikeDTOList(List<Motorbike> allMotorbikes) {
//        List<MotorbikeDTO> listMotorbikeDTO = new ArrayList<>();
//        for (Motorbike motorbike: allMotorbikes) {
//            listMotorbikeDTO.add(getMotorbikeDTOById(motorbike.getId()));
//        }
//        return listMotorbikeDTO;
//    }

    @Override
    @Transactional
    public Motorbike create(MotorbikeDTO motorbikeDTO) {
        Item item = itemService.createItem(motorbikeDTO.getItem());
        List<ItemImage> itemImageList = itemImageService.createItemImages( motorbikeDTO.getItemImages(), item);
        Motorbike motorbike = motorbikeMapper.toEntity(motorbikeDTO);
        motorbike.setItem(item);
        return motorbikeRepository.save(motorbike);

    }

//    @Override
//    public MotorbikeDTO getMotorbikeDTOById(Long id) {
//        Motorbike motorbike = motorbikeRepository.findMotorbikeById(id);
//        MotorbikeDTO motorbikeDTO = motorbikeMapper.toDTO(motorbike);
//        motorbikeDTO.setItem(itemMapper.toDTO(motorbike.getItem()));
//        motorbikeDTO.setItemImages(itemImageService.mapItemImagesListToItemImageDTOList(itemImageService.getItemImagesByItem(motorbike.getItem())));
//        return motorbikeDTO;
//    }

//    @Override
//    public List<MotorbikeDTO> getAllMotorbikes() {
//        List<Motorbike> motorbikeList = motorbikeRepository.findAll();
//        return mapMotorbikeListToMotorbikeDTOList(motorbikeList);
//    }


}
