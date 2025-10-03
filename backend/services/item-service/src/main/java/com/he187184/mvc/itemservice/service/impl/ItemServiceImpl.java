package com.he187184.mvc.itemservice.service.impl;

import com.he187184.mvc.itemservice.client.BookingClient;
import com.he187184.mvc.itemservice.client.UserClient;
import com.he187184.mvc.itemservice.constant.Category;
import com.he187184.mvc.itemservice.dto.CarDTO;
import com.he187184.mvc.itemservice.dto.ItemDTO;
import com.he187184.mvc.itemservice.dto.MotorbikeDTO;
import com.he187184.mvc.itemservice.dto.UpdateItemRequest;
import com.he187184.mvc.itemservice.entity.Item;
import com.he187184.mvc.itemservice.entity.ItemImage;
import com.he187184.mvc.itemservice.mapper.CarMapper;
import com.he187184.mvc.itemservice.mapper.ItemMapper;
import com.he187184.mvc.itemservice.mapper.MotorbikeMapper;
import com.he187184.mvc.itemservice.repository.CarRepository;
import com.he187184.mvc.itemservice.repository.ItemImageRepository;
import com.he187184.mvc.itemservice.repository.ItemRepository;
import com.he187184.mvc.itemservice.repository.MotorbikeRepository;
import com.he187184.mvc.itemservice.service.ItemImageService;
import com.he187184.mvc.itemservice.service.ItemService;
import jakarta.transaction.Transactional;
import org.example.commonlib.dto.BaseResponse;
import org.example.commonlib.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ItemServiceImpl implements ItemService {
    @Autowired
    private ItemMapper itemMapper;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private SecurityUtils securityUtils;
    @Autowired
    private ItemImageService itemImageService;
    @Autowired
    private ItemImageRepository itemImageRepository;
    @Autowired
    private CarMapper carMapper;
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private MotorbikeRepository motorbikeRepository;
    @Autowired
    private MotorbikeMapper motorbikeMapper;

    @Autowired
    UserClient userClient;

    @Autowired
    BookingClient bookingClient;

    @Override
    public Item createItem(ItemDTO itemDTO) {
        Item item = itemMapper.toEntity(itemDTO);
        item.setIsActive(true);
        item.setOwnerId(securityUtils.getCurrentUserId());
        item.setAvailabilityStatus( Item.AvailabilityStatus.AVAILABLE);
        Item savedItem = itemRepository.save(item);
        return savedItem;
    }


    @Override
    public ItemDTO updateItemStatus(UpdateItemRequest request) {
        Item item = itemRepository.findItemById(request.getItemId());
        item.setAvailabilityStatus(request.getAvailabilityStatus());
        Item savedItem = itemRepository.save(item);
        return getItemDTOById(savedItem.getId());
    }
    @Override
    public List<ItemDTO> getAllItemsByCategory(Category category) {
        List<Item> items = itemRepository.getItemsByCategoryAndStatus(category, Item.AvailabilityStatus.AVAILABLE);
        List<ItemDTO> itemDTOS = new ArrayList<>();
        for( Item item : items ) {
            ItemDTO itemDTO = getItemDTOById(item.getId());
            itemDTOS.add(itemDTO);
        }
      return itemDTOS;
    }

    @Override
    public ItemDTO getItemDTOById(Long id) {
        Item item = itemRepository.findItemById(id);
        ItemDTO itemDTO = itemMapper.toDTO(item);
        List<ItemImage> itemImageDTOList = itemImageRepository.getItemImageByItem(item);
        itemDTO.setItemImages(itemImageService.mapItemImagesListToItemImageDTOList(itemImageRepository.getItemImageByItem(item)));
        if(itemDTO.getItemImages() == null){
            itemDTO.setItemImages(new ArrayList<>());
        }
        itemDTO.setOwner(userClient.getUserById(item.getOwnerId()).getData());
        if(item.getCategory() == Category.CAR){
            CarDTO carDTO = carMapper.toDTO(carRepository.findCarById(id));
            itemDTO.setItemDetail(carDTO);
        }
        else if(item.getCategory() == Category.MOTORBIKE){
            MotorbikeDTO motorbikeDTO = motorbikeMapper.toDTO(motorbikeRepository.findMotorbikeById(id));
            itemDTO.setItemDetail(motorbikeDTO);
        }
        return itemDTO;

    }

    @Override
    public List<ItemDTO> getAllMyItems() {
        List<Item> items = itemRepository.getItemsByOwnerId(securityUtils.getCurrentUserId());
        List<ItemDTO> itemDTOS = new ArrayList<>();
        for( Item item : items ) {
            ItemDTO itemDTO = getItemDTOById(item.getId());
            itemDTOS.add(itemDTO);
        }
        return itemDTOS;

    }

    @Override
    @Transactional
    public List<ItemDTO> filterItemsByCategoryAddressAndDate(String address, Category category, LocalDateTime startDate, LocalDateTime endDate) {
        try {
            // get all items by category and address
            List<Item> items = itemRepository.filterItemsByCategoryAndAddress(category, address, Item.AvailabilityStatus.AVAILABLE);
            // get all ItemsId booked in specified date range
            Set<Long> bookedItemIds = bookingClient.getUnavailableItemIdsByDateRange(startDate, endDate).getData();
            // filter out items that are booked in the specified date range
            return items.stream()
                    .filter(item -> !bookedItemIds.contains(item.getId()))
                    .map(item -> getItemDTOById(item.getId()))
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
