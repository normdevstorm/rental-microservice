import { axiosInstance } from "../../../common/services/axios";
import {
  AvailabilityStatusType,
  ItemCategory,
  ItemCategoryType,
} from "../../../common/types/enums/enums";
import { ApiResponse } from "../../common/ApiResponse";
import { CreateCarItemRequest } from "../model/request/create_car_item_request";
import { CreateMotorbikeItemRequest } from "../model/request/create_motorbike_item_request";
import { CreateItemResponse } from "../model/response/create_item_response";
import { ItemResponse } from "../model/response/item_response";
import { UpdateItemResponse } from "../model/response/update_item_response";

class ItemApi {
  private static instance: ItemApi;

  public static getInstance(): ItemApi {
    if (!ItemApi.instance) {
      ItemApi.instance = new ItemApi();
    }
    return ItemApi.instance;
  }

  async createMotorbikeItem(
    itemData: CreateMotorbikeItemRequest
  ): Promise<ApiResponse<CreateItemResponse>> {
    try {
      const response = await axiosInstance.post<
        ApiResponse<CreateItemResponse>
      >("/items/motorbikes", itemData);
      return response.data;
    } catch (error) {
      console.error("Error creating motorbike item:", error);
      throw error;
    }
  }

  async createCarItem(
    itemData: CreateCarItemRequest
  ): Promise<ApiResponse<CreateItemResponse>> {
    try {
      const response = await axiosInstance.post<
        ApiResponse<CreateItemResponse>
      >("/items/cars", itemData);
      return response.data;
    } catch (error) {
      console.error("Error creating car item:", error);
      throw error;
    }
  }

  async updateItemStatus(
    itemId: number,
    availabilityStatus: AvailabilityStatusType
  ): Promise<ApiResponse<UpdateItemResponse>> {
    try {
      const response = await axiosInstance.patch<
        ApiResponse<UpdateItemResponse>
      >(
        `/items`,
        { itemId, availabilityStatus } // body content
      );
      return response.data;
    } catch (error) {
      console.error("Error updating item status:", error);
      throw error;
    }
  }

  async getItemById(itemId: number): Promise<ApiResponse<ItemResponse>> {
    try {
      // if (process.env.REACT_APP_USE_MOCK === "true") {
      //   return await mockItemApi.getItemById(itemId);
      // }
      const response = await axiosInstance.get<ApiResponse<ItemResponse>>(
        `/items/${itemId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching item by ID:", error);
      throw error;
    }
  }

  async getAllItemByCategory(
    category: ItemCategoryType
  ): Promise<ApiResponse<ItemResponse[]>> {
    try {
      // if (process.env.REACT_APP_USE_MOCK === "true") {
      //   return await mockItemApi.getAllItemByCategory(category);
      // }
      const params = new URLSearchParams();
      params.append("category", category);
      const response = await axiosInstance.get<ApiResponse<ItemResponse[]>>(
        `/items`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching items by category:", error);
      throw error;
    }
  }

  async getAllMyItems(): Promise<ApiResponse<ItemResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<ItemResponse[]>>(
        `/items/me`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching your items:", error);
      throw error;
    }
  }

  async filterItemsByAddressAndCategory(
    category: ItemCategoryType
  ): Promise<ApiResponse<ItemResponse[]>> {
    try {
      // let list = mockAllItems;
      const result = await this.getAllItemByCategory(category);
      // else if (category === ItemCategory.MOTORBIKE) list = mockMotorbikeItems;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async filterItemsByAddressCategoryAndDateRange(
    address: string,
    category: ItemCategoryType,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<ItemResponse[]>> {
    try {
      const params = new URLSearchParams();
      params.append("address", address);
      params.append("category", category);
      params.append("startDate", startDate);
      params.append("endDate", endDate);
      const result = await axiosInstance.get<ApiResponse<ItemResponse[]>>(
        `/items/filter`,
        { params }
      );
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}
export const itemApi = ItemApi.getInstance();
