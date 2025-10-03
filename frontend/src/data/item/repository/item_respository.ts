import { toUtcMidnight, toUtcMidnightISO } from "../../../common/helper";
import { axiosInstance } from "../../../common/services/axios";
import {
  AvailabilityStatus,
  AvailabilityStatusType,
  ItemCategoryType,
} from "../../../common/types/enums/enums";
import { isMotorbikeItem } from "../../../common/types/guards/type_guards";
import { ApiResponse } from "../../common/ApiResponse";
import { itemApi } from "../api/item_api";
import { mockItemApi } from "../api/mock_item_api";
import { CarItem } from "../model/common/car_item";
import { MotorbikeItem } from "../model/common/motorbike_item";
import { CreateCarItemRequest } from "../model/request/create_car_item_request";
import { CreateItemRequest } from "../model/request/create_item_request";
import { CreateMotorbikeItemRequest } from "../model/request/create_motorbike_item_request";
import { CreateItemResponse } from "../model/response/create_item_response";
import { ItemResponse } from "../model/response/item_response";
import { UpdateItemResponse } from "../model/response/update_item_response";

class ItemRepostory {
  private static instance: ItemRepostory;

  public static getInstance(): ItemRepostory {
    if (!ItemRepostory.instance) {
      ItemRepostory.instance = new ItemRepostory();
    }
    return ItemRepostory.instance;
  }

  // async createItem(itemData: CreateItemRequest): Promise<ItemResponse> {
  //   const response = await itemApi.createItem(itemData);
  //   return response.data;
  // }

  async createMotorbikeItem(
    itemData: CreateMotorbikeItemRequest
  ): Promise<CreateItemResponse> {
    const response = await itemApi.createMotorbikeItem(itemData);
    return response.data;
  }

  async createCarItem(
    itemData: CreateCarItemRequest
  ): Promise<CreateItemResponse> {
    const response = await itemApi.createCarItem(itemData);
    return response.data;
  }

  async getItemById(itemId: number): Promise<ItemResponse> {
    const response = await itemApi.getItemById(itemId);
    return response.data;
  }
  async getAllItemByCategory(
    category: ItemCategoryType
  ): Promise<ItemResponse[]> {
    const response = await itemApi.getAllItemByCategory(category);
    return response.data;
  }

  async getAllMyItems(): Promise<ItemResponse[]> {
    const response = await itemApi.getAllMyItems();
    return response.data;
  }

  async updateItemStatus(
    itemId: number,
    status: AvailabilityStatusType
  ): Promise<ApiResponse<UpdateItemResponse>> {
    return await itemApi.updateItemStatus(itemId, status);
  }

  async filterItemByAddressAndCategory(
    address: string,
    category: ItemCategoryType
  ): Promise<ItemResponse[]> {
    try {
      const response = await itemApi.filterItemsByAddressAndCategory(category);
      const list = response.data;
      const filtered = list.filter((i) =>
        i.address?.toLowerCase().includes(address.toLowerCase())
      );
      return filtered;
    } catch (error) {
      throw error;
    }
  }

  async filterItemByAddressCategoryAndDateRange(
    address: string,
    category: ItemCategoryType,
    startDate: Date,
    endDate: Date
  ): Promise<ItemResponse[]> {
    try {
      const response = await itemApi.filterItemsByAddressCategoryAndDateRange(
        address,
        category,
        toUtcMidnight(startDate),
        toUtcMidnight(endDate)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const itemRepository = ItemRepostory.getInstance();
