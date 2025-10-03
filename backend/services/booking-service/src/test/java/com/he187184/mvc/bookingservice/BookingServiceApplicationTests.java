package com.he187184.mvc.bookingservice;

import com.he187184.mvc.bookingservice.repository.BookingRepository;
import com.he187184.mvc.bookingservice.service.BookingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@SpringBootTest
class BookingServiceApplicationTests {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Test
    void contextLoads() {
    }

    @Test
    void testFilterItemsByConflcitSchedules() {
        // Implement test logic here
        Set<Long> ids = bookingService.getUnavailableItemIdsByDateRange(
                LocalDateTime.of(2025, 9, 26, 0, 0),
                LocalDateTime.of(2025, 10, 4, 0, 0)
        );
        System.out.println(ids);
    }

}
