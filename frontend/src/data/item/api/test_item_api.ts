import { ApiResponse } from "../../common/ApiResponse";
import { ItemResponse } from "../model/response/item_response";
import { MotorbikeItem } from "../model/common/motorbike_item";
import {
  FuelEnum,
  ImagePriority,
  ItemCategory,
} from "../../../common/types/enums/enums";
import { itemApi } from "./item_api";
import {
  isCarItem,
  isMotorbikeItem,
} from "../../../common/types/guards/type_guards";
import { itemRepository } from "../repository/item_respository";

// Mock Motorbike Response
export const mockMotorbikeResponse: ApiResponse<ItemResponse> = {
  success: true,
  code: "200",
  message: "Item retrieved successfully",
  data: {
    id: 2,
    name: "Honda CBR650R",
    description: "Sporty motorcycle for weekend rides",
    price: 35,
    latePrice: 50,
    depositAmount: 300,

    address: "456 Park Ave, City",
    conditionRating: 4.8,
    availabilityStatus: "AVAILABLE",
    createdAt: "2025-09-12T09:15:00Z",
    itemValue: 9000,
    category: "MOTORBIKE",
    itemImages: [
      {
        id: 3,
        imageUrl: "https://example.com/cbr1.jpg",
        imageType: ImagePriority.MAIN,
      },
      {
        id: 4,
        imageUrl: "https://example.com/cbr2.jpg",
        imageType: ImagePriority.EXTRA,
      },
    ],
    itemDetail: {
      id: 101,
      itemId: 2,
      brand: "Honda",
      model: "CBR650R",
      year: 2024,
      transmission: "Manual",
      engineCapacity: 649,
      fuelType: FuelEnum.PETROL,
      licensePlate: "MC-650-CBR",
      kms: 1500,
    },
  },
};

// Usage example
export async function testItemApi() {
  try {
    // Use the unknown type when you don't know which type it will be
    const response = await itemRepository.getItemById(2);
    const itemSpec = response.itemDetail;
    if (isMotorbikeItem(itemSpec)) {
      // Now TypeScript knows this is ItemMotorbike
      console.log(
        `Motorbike ${itemSpec.brand} ${itemSpec.model} with ${itemSpec.engineCapacity}cc engine`
      );
    } else if (isCarItem(itemSpec)) {
      // Now TypeScript knows this is CarItem
      console.log(`Car with ${itemSpec.seats} seats`);
    }
  } catch (error) {
    console.error("Error testing API:", error);
  }
}
