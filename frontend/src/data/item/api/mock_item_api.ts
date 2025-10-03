import { ApiResponse } from "../../common/ApiResponse";
import { ItemResponse } from "../model/response/item_response";
import { CreateItemRequest } from "../model/request/create_item_request";
import {
  AvailabilityStatus,
  ItemCategory,
  ItemCategoryType,
} from "../../../common/types/enums/enums";
import {
  mockAllItems,
  mockCarItems,
  mockMotorbikeItems,
  makeApiResponse,
  mockGetAllCarsResponse,
  mockGetAllItemsResponse,
  mockGetAllMotorbikesResponse,
  mockGetItemByIdResponse,
} from "./mock_item_data";

class MockItemApi {
  private static instance: MockItemApi;

  public static getInstance(): MockItemApi {
    if (!MockItemApi.instance) {
      MockItemApi.instance = new MockItemApi();
    }
    return MockItemApi.instance;
  }

  async createItem(
    itemData: CreateItemRequest
  ): Promise<ApiResponse<ItemResponse>> {
    const newId = Math.max(...mockAllItems.map((i) => i.id)) + 1;
    const created: ItemResponse = {
      ...(itemData as any),
      id: newId,
    };
    // simulate latency
    await new Promise((r) => setTimeout(r, 300));
    return makeApiResponse(created, "Mock created", true, "200");
  }

  async getItemById(itemId: number): Promise<ApiResponse<ItemResponse>> {
    await new Promise((r) => setTimeout(r, 250));
    const prepared = mockGetItemByIdResponse[itemId];
    if (prepared) return prepared;
    const found = mockAllItems.find((i) => i.id === itemId);
    if (!found) throw new Error("Mock item not found");
    return makeApiResponse(found, "Mock OK", true, "200");
  }

  async getAllItemByCategory(
    category: ItemCategoryType
  ): Promise<ApiResponse<ItemResponse[]>> {
    await new Promise((r) => setTimeout(r, 250));
    if (category === ItemCategory.CAR) return mockGetAllCarsResponse;
    if (category === ItemCategory.MOTORBIKE)
      return mockGetAllMotorbikesResponse;
    return mockGetAllItemsResponse;
  }

  async filterItemsByAddressAndCategory(
    address: string,
    category: ItemCategoryType
  ): Promise<ApiResponse<ItemResponse[]>> {
    await new Promise((r) => setTimeout(r, 250));
    let list = mockAllItems;
    if (category === ItemCategory.CAR) list = mockCarItems;
    else if (category === ItemCategory.MOTORBIKE) list = mockMotorbikeItems;
    const filtered = list.filter(
      (i) =>
        i.address?.toLowerCase().includes(address.toLowerCase()) &&
        i.availabilityStatus === AvailabilityStatus.AVAILABLE
    );
    return makeApiResponse(filtered, "Mock filtered", true, "200");
  }
}

export const mockItemApi = MockItemApi.getInstance();
