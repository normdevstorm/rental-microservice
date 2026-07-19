package com.he187184.mvc.bookingservice.controller;

import com.he187184.mvc.bookingservice.dto.request.BookingRequestDTO;
import com.he187184.mvc.bookingservice.dto.request.UpdateBookingRequest;
import com.he187184.mvc.bookingservice.dto.response.BookingResponseDTO;
import com.he187184.mvc.bookingservice.dto.response.ScheduleDTO;
import com.he187184.mvc.bookingservice.service.BookingService;
import org.example.commonlib.dto.BaseResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            BookingResponseDTO booking = bookingService.getBookingById(id);
            BaseResponse<BookingResponseDTO> response = new BaseResponse<>(
                    "Get booking successfully", true, "SUCCESS", booking);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            BaseResponse<BookingResponseDTO> error = new BaseResponse<>(
                    e.getMessage(), false, "ERROR", null);
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/renter")
    public ResponseEntity<BaseResponse<BookingResponseDTO[]>> getAllBookingsByRenter() {
        try {
            BookingResponseDTO[] bookings = bookingService.getAllBookingsByRenter();
            BaseResponse<BookingResponseDTO[]> response = new BaseResponse<>(
                    "Get all bookings of renter "+ "successfully", true, "SUCCESS", bookings);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            BaseResponse<BookingResponseDTO[]> error = new BaseResponse<>(
                    e.getMessage(), false, "ERROR", null);
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<BaseResponse<BookingResponseDTO[]>> getAllBookingsByOwnerId(@PathVariable Long ownerId) {
        try {
            BookingResponseDTO[] bookings = bookingService.getAllBookingsByOwnerId(ownerId);
            BaseResponse<BookingResponseDTO[]> response = new BaseResponse<>(
                    "Get all bookings of owner " + ownerId + " successfully", true, "SUCCESS", bookings);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            BaseResponse<BookingResponseDTO[]> error = new BaseResponse<>(
                    e.getMessage(), false, "ERROR", null);
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequestDTO request,
                                           BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            BaseResponse<BookingResponseDTO> error = new BaseResponse<>(
                    "Invalid input", false, "INVALID_INPUT", null);
            return ResponseEntity.badRequest().body(error);
        }
        try {
            BookingResponseDTO booking = bookingService.createBooking(request);
            BaseResponse<BookingResponseDTO> response = new BaseResponse<>(
                    "Create booking successfully", true, "SUCCESS", booking);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            BaseResponse<BookingResponseDTO> error = new BaseResponse<>(
                    e.getMessage(), false, "ERROR", null);
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id,
                                           @Valid @RequestBody UpdateBookingRequest request,
                                           BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            BaseResponse<BookingResponseDTO> error = new BaseResponse<>(
                    "Invalid input", false, "INVALID_INPUT", null);
            return ResponseEntity.badRequest().body(error);
        }

        try {
            BookingResponseDTO booking = bookingService.updateBooking(id, request);
            BaseResponse<BookingResponseDTO> response = new BaseResponse<>(
                    "Update booking successfully", true, "SUCCESS", booking);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            BaseResponse<BookingResponseDTO> error = new BaseResponse<>(
                    e.getMessage(), false, "ERROR", null);
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            BaseResponse<String> response = new BaseResponse<>(
                    "Delete booking successfully", true, "SUCCESS", "Booking has been deleted");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            BaseResponse<String> error = new BaseResponse<>(
                    e.getMessage(), false, "ERROR", null);
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/schedule")
    public ResponseEntity<?> getAllBookingsBySchedule(@RequestParam Long itemId) {
      List<ScheduleDTO> scheduleDTOList = bookingService.getBookingsWithScheduleByItemID(itemId);
        BaseResponse<?> response = new BaseResponse<>(
                "Get schedule successfully", true, "SUCCESS", scheduleDTOList);
        return ResponseEntity.ok(response);

    }

    @GetMapping("/unavailable-items" )
    public ResponseEntity<?> getUnavailableItemIdsByDateRange(@RequestParam LocalDateTime startDate, @RequestParam LocalDateTime endDate) {
        try {
            Set<Long> itemIds = bookingService.getUnavailableItemIdsByDateRange(startDate, endDate);
            BaseResponse<Set<Long>> response = new BaseResponse<>(
                    "Get unavailable items successfully", true, "SUCCESS", itemIds);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            BaseResponse<Set<Long>> error = new BaseResponse<>(
                    e.getMessage(), false, "ERROR", null);
            return ResponseEntity.badRequest().body(error);
        }
    }


}
