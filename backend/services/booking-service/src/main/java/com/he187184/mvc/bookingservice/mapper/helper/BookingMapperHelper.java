package com.he187184.mvc.bookingservice.mapper.helper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.he187184.mvc.bookingservice.client.ItemClient;
import com.he187184.mvc.bookingservice.client.UserClient;
import com.he187184.mvc.bookingservice.dto.ItemDTO;
import com.he187184.mvc.bookingservice.dto.UserDTO;
import com.he187184.mvc.bookingservice.mapper.annotations.MapItemIdToItemDto;
import com.he187184.mvc.bookingservice.mapper.annotations.MapUserIdToUserDto;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BookingMapperHelper {

    private final ItemClient itemClient;
    private final UserClient userClient;

    @Autowired
    public BookingMapperHelper(ItemClient itemClient, UserClient userClient) {
        this.itemClient = itemClient;
        this.userClient = userClient;
    }

    @MapItemIdToItemDto
    public ItemDTO mapItemIdToItemDto(Long itemId) {
        try {
            if (itemId == null) {
                return null;
            }
            BaseResponse response = itemClient.getItemById(itemId);
            if (response != null && response.isSuccess()) {
                return new ObjectMapper().convertValue(response.getData(), ItemDTO.class);
            }
            throw new RuntimeException("Failed to fetch ItemDTO for itemId: " + itemId);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to fetch ItemDTO for itemId: " + itemId);
        }
    }

    @MapUserIdToUserDto
    public UserDTO mapUserIdToUserDto(Long userId) {
        if (userId == null) {
            return null;
        }
        BaseResponse<UserDTO> response = userClient.getUserById(userId);
        if (response != null && response.isSuccess()) {
            return response.getData();
        }
        throw new RuntimeException("Failed to fetch UserDTO for userId: " + userId);
    }

}
