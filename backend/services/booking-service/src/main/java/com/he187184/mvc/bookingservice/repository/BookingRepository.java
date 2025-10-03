package com.he187184.mvc.bookingservice.repository;

import com.he187184.mvc.bookingservice.entity.Booking;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Booking[] findBookingsByRenterId(Long renterId);

    @Query("SELECT b FROM Booking b WHERE b.itemId = :itemId AND b.startTime > :now AND b.status IN (:statuses)")
    List<Booking> findScheduleByItemId(
            @Param("itemId") Long itemId,
            @Param("now") LocalDateTime now,
            @Param("statuses") List<Booking.Status> statuses);


    @Query(
             "SELECT distinct b.itemId FROM Booking b WHERE b.status NOT IN ('CANCELLED', 'COMPLETED') AND " +
                    "((b.startTime <= :startDate AND :startDate < b.endTime) OR " +
                    "(b.startTime < :endDate AND :endDate <= b.endTime) OR " +
                    "(:startDate <= b.startTime AND b.endTime <= :endDate))"
    )
    Set<Long> findItemIdOfBookingConflictWithDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
