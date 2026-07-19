package com.he187184.mvc.bookingservice.mapper;


import com.he187184.mvc.bookingservice.client.ItemClient;
import com.he187184.mvc.bookingservice.dto.request.BookingRequestDTO;
import com.he187184.mvc.bookingservice.dto.request.UpdateBookingRequest;
import com.he187184.mvc.bookingservice.dto.response.BookingResponseDTO;
import com.he187184.mvc.bookingservice.entity.Booking;
import com.he187184.mvc.bookingservice.mapper.annotations.MapItemIdToItemDto;
import com.he187184.mvc.bookingservice.mapper.annotations.MapUserIdToUserDto;
import com.he187184.mvc.bookingservice.mapper.helper.BookingMapperHelper;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

    @Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = {BookingMapperHelper.class})
    public interface BookingMapper {

        Booking toBookingEntity(BookingRequestDTO request);

        // map from renterId to UserDTO and itemId to ItemDTO in BookingResponseDTO
        @Mapping(target = "renter", source = "renterId", qualifiedBy = MapUserIdToUserDto.class)
        @Mapping(target = "item", source = "itemId", qualifiedBy = MapItemIdToItemDto.class)
        BookingResponseDTO toBookingResponseDTO(Booking booking);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        void partialUpdate(@MappingTarget Booking booking, UpdateBookingRequest request);
    }
