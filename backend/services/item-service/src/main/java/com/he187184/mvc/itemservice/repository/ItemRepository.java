package com.he187184.mvc.itemservice.repository;

import com.he187184.mvc.itemservice.constant.Category;
import com.he187184.mvc.itemservice.entity.Item;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> getItemsByOwnerId(Long ownerId);
        @Query("SELECT i FROM Item i WHERE i.category = :category AND i.availabilityStatus = :status")
        List<Item> getItemsByCategoryAndStatus(@Param("category") Category category,
                                               @Param("status") Item.AvailabilityStatus status);


    Item findItemById(Long id);

    @Query("SELECT i FROM Item i WHERE i.category = :category AND i.address LIKE %:address% AND i.availabilityStatus = :availabilityStatus")
    List<Item> filterItemsByCategoryAndAddress(@Param("category") Category category,@Param("address") String address,@Param("availabilityStatus") Item.AvailabilityStatus availabilityStatus);
}
