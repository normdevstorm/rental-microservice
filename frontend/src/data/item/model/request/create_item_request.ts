import {
  AvailabilityStatusType,
  ItemCategoryType,
} from "../../../../common/types/enums/enums";
import { ImageModel } from "../common/image_model";

export interface CreateItemRequest<T = any> {
  name: string;
  description: string;
  price: number;
  latePrice: number;
  depositNumber: number;
  amount: number;
  address: string;
  conditionRating: number;
  availabilityStatus: AvailabilityStatusType;
  createdAt: string;
  itemValue: number;
  category: ItemCategoryType;
  imageUrl: ImageModel[];
  itemDetail: T;
}
