package com.he187184.mvc.bookingservice.service;

import com.he187184.mvc.bookingservice.client.ItemClient;
import com.he187184.mvc.bookingservice.client.UserClient;

import com.he187184.mvc.bookingservice.dto.request.BookingRequestDTO;
import com.he187184.mvc.bookingservice.dto.request.UpdateBookingRequest;
import com.he187184.mvc.bookingservice.dto.response.BookingResponseDTO;
import com.he187184.mvc.bookingservice.dto.response.ScheduleDTO;
import com.he187184.mvc.bookingservice.entity.Booking;
import com.he187184.mvc.bookingservice.mapper.BookingMapper;
import com.he187184.mvc.bookingservice.repository.BookingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.commonlib.security.SecurityUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService {
    BookingRepository bookingRepository;
    BookingMapper bookingMapper;
    SecurityUtils securityUtils;
    UserClient userClient;
    ItemClient itemClient;

    // CRUD Operations
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        // Validate input
        validateBookingRequest(request);
        // Get current user as renter
        Long renterId = securityUtils.getCurrentUserId();
        // Validate item exists
//        ItemDTO item = validateItem(request.getItemId());
        // Validate booking time
        validateBookingTime(request.getStartTime(), request.getEndTime());
        // Create booking
        Booking booking = bookingMapper.toBookingEntity(request);
        booking.setRenterId(renterId);
        booking.setStatus(Booking.Status.PENDING);
        booking.setPaymentStatus(Booking.PaymentStatus.INITIAL);
        BookingResponseDTO mappedBookingDto = bookingMapper.toBookingResponseDTO(booking);
        bookingRepository.save(booking);
        return mappedBookingDto;
    }

    public BookingResponseDTO updateBooking(Long id, UpdateBookingRequest request) {
        Booking booking = findBookingById(id);
        ///TODO: validate updated booking status later on
        // Validate user can update this booking (only renter)
//        Long currentUserId = securityUtils.getCurrentUserId();
//        if (!booking.getRenterId().equals(currentUserId)) {
//            throw new RuntimeException("You don't have permission to update this booking");
//        }
        // Validate if booking can be updated
        if (booking.getStatus() == Booking.Status.CANCELLED ||
                booking.getStatus() == Booking.Status.COMPLETED) {
            throw new RuntimeException("Cannot update booking in current status: " + booking.getStatus());
        }
//
//        // Validate updated times if present
//        validateBookingTime(request.getStartTime(), request.getEndTime());

        bookingMapper.partialUpdate(booking, request);
        BookingResponseDTO mappedBookingDto =  bookingMapper.toBookingResponseDTO(booking);
        Booking savedBooking = bookingRepository.save(booking);
        return mappedBookingDto ;
    }

    public void deleteBooking(Long id) {
        Booking booking = findBookingById(id);
        // Validate user can delete this booking (only renter)
        Long currentUserId = securityUtils.getCurrentUserId();
        if (!booking.getRenterId().equals(currentUserId)) {
            throw new RuntimeException("You don't have permission to delete this booking");
        }
        // Only allow deletion if booking is in PENDING status
        if (booking.getStatus() != Booking.Status.PENDING) {
            throw new RuntimeException("Can only delete booking in PENDING status");
        }
        bookingRepository.deleteById(id);
    }

    private Booking findBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
    }

    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = findBookingById(id);
        return bookingMapper.toBookingResponseDTO(booking);
    }
    public BookingResponseDTO[] getAllBookingsByRenter() {
        Long renterId = securityUtils.getCurrentUserId();
        Booking[] bookings = bookingRepository.findBookingsByRenterId((renterId));
        return Arrays.stream(bookings)
                .map(bookingMapper::toBookingResponseDTO)
                .toArray(BookingResponseDTO[]::new);
    }

    // TODO: implement getAllBookingsByOwnerId when getMyItems of item client is all read
    public BookingResponseDTO[] getAllBookingsByOwnerId(Long ownerId) {
        // Lấy tất cả booking
        List<Booking> allBookings = bookingRepository.findAll();
        // Map theo đúng mapper đang dùng bên renter, rồi lọc theo ownerId
        return allBookings.stream()
                .map(bookingMapper::toBookingResponseDTO) // dùng chung luồng MapStruct + helper
                .filter(dto -> dto != null
                        && dto.getItem() != null
                        && dto.getItem().getOwner() != null
                        && ownerId.equals(dto.getItem().getOwner().getId()))
                .toArray(BookingResponseDTO[]::new);
    }
    public List<ScheduleDTO> getBookingsWithScheduleByItemID(Long itemId) {
        List<Booking.Status> bookingStatuses = Arrays.asList(Booking.Status.PENDING, Booking.Status.CONFIRMED, Booking.Status.NEGOTIATION);
        List<ScheduleDTO> scheduleDTOList = new ArrayList<>();
        List<Booking> bookings = bookingRepository.findScheduleByItemId(itemId,LocalDateTime.now(),bookingStatuses);
        for (Booking booking : bookings) {
            scheduleDTOList.add(new ScheduleDTO(booking.getStartTime(), booking.getEndTime()));
        }
        return scheduleDTOList;
    }




//    private UserDTO validateUser(Integer userId) {
//        try {
//            UserDTO user = userClient.getUserById(Long.valueOf(userId)).getData();
//            if (user == null || !user.getIsActive()) {
//                throw new RuntimeException("User is not active or invalid");
//            }
//            return user;
//        } catch (FeignException.NotFound e) {
//            throw new RuntimeException("User not found with ID: " + userId);
//        }
//    }

//    private ItemDTO validateItem(Long itemId) {
//        try {
//            ItemDTO item = itemClient.getItemById(itemId).getData();
//            if (item == null || !item.getIsActive()) {
//                throw new RuntimeException("Item is not active or invalid");
//            }
//            if (item.getAvailabilityStatus() != ItemDTO.AvailabilityStatus.AVAILABLE) {
//                throw new RuntimeException("Item is not available for booking");
//            }
//            return item;
//        } catch (FeignException.NotFound e) {
//            throw new RuntimeException("Item not found with ID: " + itemId);
//        }
//
//    }


    // Private helper methods
    private void validateBookingRequest(BookingRequestDTO request) {
        if (request == null) {
            throw new RuntimeException("Booking request cannot be null");
        }
        if (request.getItemId() == null) {
            throw new RuntimeException("Item ID is required");
        }
        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new RuntimeException("Start time and end time are required");
        }
    }

    private void validateBookingTime(LocalDateTime startTime, LocalDateTime endTime) {
        LocalDateTime now = LocalDateTime.now();

        if (startTime.isBefore(now)) {
            throw new RuntimeException("Start time cannot be in the past");
        }

        if (endTime.isBefore(startTime)) {
            throw new RuntimeException("End time cannot be before start time");
        }

        if (startTime.isEqual(endTime)) {
            throw new RuntimeException("Start time and end time cannot be the same");
        }
    }

    public Set<Long> getUnavailableItemIdsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null) {
            throw new RuntimeException("Start time and end time are required");
        }
        if (endDate.isBefore(startDate) || endDate.isEqual(startDate)) {
            throw new RuntimeException("End time must be after start time");
        }
        return bookingRepository.findItemIdOfBookingConflictWithDateRange(startDate, endDate);
    }


//    private Double calculateTotalCost(Double pricePerDay, LocalDateTime startTime, LocalDateTime endTime) {
//        long days = java.time.Duration.between(startTime, endTime).toDays();
//        if (days == 0) days = 1; // Minimum 1 day
//        return pricePerDay * days;
//    }

}



