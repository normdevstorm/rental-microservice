package com.he187184.mvc.itemservice.controller;

import com.he187184.mvc.itemservice.constant.Category;
import com.he187184.mvc.itemservice.dto.ItemDTO;
import com.he187184.mvc.itemservice.dto.UpdateItemRequest;
import com.he187184.mvc.itemservice.mapper.CarMapper;
import com.he187184.mvc.itemservice.mapper.ItemImageMapper;
import com.he187184.mvc.itemservice.mapper.ItemMapper;
import com.he187184.mvc.itemservice.mapper.MotorbikeMapper;
import com.he187184.mvc.itemservice.repository.CarRepository;
import com.he187184.mvc.itemservice.repository.ItemImageRepository;
import com.he187184.mvc.itemservice.repository.ItemRepository;
import com.he187184.mvc.itemservice.repository.MotorbikeRepository;
import com.he187184.mvc.itemservice.service.ItemService;
import org.example.commonlib.dto.BaseResponse;
import org.example.commonlib.dto.ResponseCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
public class ItemController {
    @Autowired
    private ItemService itemService;

    @GetMapping("/")
    public ResponseEntity<?> getAllByCategory(@RequestParam Category category) {
        List<ItemDTO> itemDTOList = new ArrayList<>();
        itemDTOList = itemService.getAllItemsByCategory(category);
        BaseResponse baseResponse = new BaseResponse<>(ResponseCode.SUCCESS, true,itemDTOList);
        return ResponseEntity.ok(baseResponse);

    }
    @GetMapping("/{id}")
    public  ResponseEntity<?> getItem(@PathVariable Long id) {
        ItemDTO itemDTO = itemService.getItemDTOById(id);
        BaseResponse baseResponse =  new BaseResponse<>(ResponseCode.SUCCESS, true,itemDTO);
        return ResponseEntity.ok(baseResponse);
    }

    @GetMapping("/filter")
    public  ResponseEntity<?> filterItems(@RequestParam String address,
                                          @RequestParam Category category,
                                          @RequestParam(required = true) LocalDateTime startDate,
                                          @RequestParam(required = true) LocalDateTime endDate) {
        List<ItemDTO> itemDTOList;
        itemDTOList = itemService.filterItemsByCategoryAddressAndDate(address,category,
                startDate,
                endDate);
        BaseResponse baseResponse = new BaseResponse<>(ResponseCode.SUCCESS, true,itemDTOList);
        return ResponseEntity.ok(baseResponse);
    }

    @GetMapping("/me")
    public  ResponseEntity<?> getALlMyItem() {
        List<ItemDTO> itemDTOList = new ArrayList<>();
        itemDTOList = itemService.getAllMyItems();
        BaseResponse baseResponse = new BaseResponse<>(ResponseCode.SUCCESS, true,itemDTOList);
        return ResponseEntity.ok(baseResponse);
    }
    @PatchMapping()
    public  ResponseEntity<?> updateItemStatus(@RequestBody UpdateItemRequest updateItemRequest) {
        ItemDTO itemDTO = itemService.updateItemStatus(updateItemRequest);
        BaseResponse baseResponse =  new BaseResponse<>(ResponseCode.SUCCESS, true,itemDTO);
        return ResponseEntity.ok(baseResponse);
    }

}
