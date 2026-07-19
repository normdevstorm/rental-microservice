package com.he187184.mvc.itemservice.controller;


import com.he187184.mvc.itemservice.client.UserClient;
import com.he187184.mvc.itemservice.dto.CarDTO;
import com.he187184.mvc.itemservice.dto.ItemDTO;
import com.he187184.mvc.itemservice.dto.MotorbikeDTO;
import com.he187184.mvc.itemservice.dto.RoleUpdateRequest;
import com.he187184.mvc.itemservice.entity.Car;
import com.he187184.mvc.itemservice.entity.Motorbike;
import com.he187184.mvc.itemservice.mapper.MotorbikeMapper;
import com.he187184.mvc.itemservice.service.CarService;
import com.he187184.mvc.itemservice.service.ItemService;
import com.he187184.mvc.itemservice.service.MotorbikeService;
import feign.Body;
import jakarta.validation.Valid;
import org.example.commonlib.dto.BaseResponse;
import org.example.commonlib.dto.ResponseCode;
import org.example.commonlib.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarController {
    @Autowired
    private CarService carService;
    @Autowired
    private ItemService itemService;
    @Autowired
    MotorbikeMapper motorbikeMapper;

    @Autowired
    private SecurityUtils securityUtils;

    @Autowired
    private UserClient userClient;
    @PostMapping
    public ResponseEntity<?> createCar (@Valid @RequestBody CarDTO carDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            BaseResponse error = new BaseResponse<CarDTO>("Invalid input", false,"INVALID_INPUT",null);
            return ResponseEntity.badRequest().body(error);
        }
        BaseResponse baseResponse = new BaseResponse<>();
        Car car = carService.create(carDTO);
        if( !securityUtils.hasRoleOwner()){
            baseResponse = userClient.refreshTokenAfterAddingRole(new RoleUpdateRequest(securityUtils.getCurrentUserId(), "OWNER",securityUtils.getDeviceId()));
        }
        else{
            ItemDTO itemDTO = itemService.getItemDTOById(car.getId());
            baseResponse = new  BaseResponse<>("Create car successfully", true,"SUCCESS",itemDTO);

        }

        return  ResponseEntity.ok(baseResponse);
    }


}
//    package com.he187184.mvc.itemservice.controller;
//
//    import com.he187184.mvc.itemservice.dto.CarDTO;
//    import com.he187184.mvc.itemservice.dto.MotorbikeDTO;
//    import com.he187184.mvc.itemservice.entity.Car;
//    import com.he187184.mvc.itemservice.entity.Motorbike;
//    import com.he187184.mvc.itemservice.mapper.CarMapper;
//    import com.he187184.mvc.itemservice.mapper.MotorbikeMapper;
//    import com.he187184.mvc.itemservice.service.CarService;
//    import com.he187184.mvc.itemservice.service.MotorbikeService;
//    import jakarta.validation.Valid;
//    import org.example.commonlib.dto.BaseResponse;
//    import org.springframework.beans.factory.annotation.Autowired;
//    import org.springframework.stereotype.Controller;
//    import org.springframework.validation.BindingResult;
//    import org.springframework.web.bind.annotation.*;
//
//    import java.util.List;
//
//    @Controller
//    @RequestMapping("/cars")
//    public class CarController {
//        @Autowired
//        private CarService carService;
//        @Autowired
//        CarMapper carMapper;
//        @PostMapping("/")
//        public BaseResponse<CarDTO>addCar(@Valid @RequestBody CarDTO carDTO, BindingResult bindingResult) {
//            if (bindingResult.hasErrors()) {
//                return new BaseResponse<CarDTO>("Invalid input", false,"INVALID_INPUT",null);
//
//            }
//            Car car = carService.create(carDTO);
//            CarDTO dto = get
//        }
//                return new BaseResponse<MotorbikeDTO>("Invalid input", false,"INVALID_INPUT",null);
//            }
//            Motorbike motorbike = motorbikeService.create(motorbikeDTO);
//            MotorbikeDTO dto = getMotorbike(motorbike.getId()).getData();
//            return new BaseResponse<>("Create motorbike successfully", true,"SUCCESS",dto);
//
//        }
//        @GetMapping("/{id}")
//        public BaseResponse<CarDTO> getCar(@PathVariable Long id) {
//            MotorbikeDTO dto = motorbikeService.getMotorbikeDTOById(id);
//            return new BaseResponse<>("Get motorbike", true,"SUCCESS",dto);
//        }
//        @GetMapping("/")
//        public BaseResponse<List<MotorbikeDTO>> getAllMotorbikes(){
//            return new BaseResponse<>("Get all motorbike successfully", true,"SUCCESS",motorbikeService.getAllMotorbikes());
//        }
//
//    }
