    package com.he187184.mvc.itemservice.controller;

    import com.fasterxml.jackson.databind.ser.Serializers;
    import com.he187184.mvc.itemservice.client.UserClient;
    import com.he187184.mvc.itemservice.dto.ItemDTO;
    import com.he187184.mvc.itemservice.dto.MotorbikeDTO;
    import com.he187184.mvc.itemservice.dto.RoleUpdateRequest;
    import com.he187184.mvc.itemservice.entity.Motorbike;
    import com.he187184.mvc.itemservice.mapper.MotorbikeMapper;
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
    @RequestMapping("/motorbikes")
    public class MotorbikeController {
        @Autowired
        private MotorbikeService motorbikeService;

        @Autowired
        MotorbikeMapper motorbikeMapper;

        @Autowired
        private ItemService itemService;

        @Autowired
        private  SecurityUtils securityUtils;

        @Autowired
        private UserClient userClient;
        @PostMapping
        public ResponseEntity<?> createMotorbike (@Valid @RequestBody MotorbikeDTO motorbikeDTO, BindingResult bindingResult) {
            if (bindingResult.hasErrors()) {
                BaseResponse error = new BaseResponse<MotorbikeDTO>("Invalid input", false,"INVALID_INPUT",null);
                return ResponseEntity.badRequest().body(error);
            }
            Motorbike motorbike = motorbikeService.create(motorbikeDTO);
            BaseResponse baseResponse =  new BaseResponse<>();
           if( !securityUtils.hasRoleOwner()){
               baseResponse = userClient.refreshTokenAfterAddingRole(new RoleUpdateRequest(securityUtils.getCurrentUserId(), "OWNER",securityUtils.getDeviceId()));
           }
           else{
               ItemDTO itemDTO = itemService.getItemDTOById(motorbike.getId());
               baseResponse = new  BaseResponse<>("Create motorbike successfully", true,"SUCCESS",itemDTO);
           }

               return  ResponseEntity.ok(baseResponse);
        }


    }
