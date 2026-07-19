import {
  AvailabilityStatusType,
  ItemCategoryType,
} from "../../../../common/types/enums/enums";
import { UserResponse } from "../../../user/model/response/user_response";
import { ImageModel } from "../common/image_model";

export interface ItemResponse {
  id: number;
  owner?: UserResponse;
  name: string;
  description: string;
  price: number;
  latePrice: number;
  itemValue: number;
  depositAmount: number;
  address: string;
  conditionRating?: number;
  availabilityStatus: AvailabilityStatusType;
  createdAt: string;
  category: ItemCategoryType;
  itemImages: ImageModel[];
  itemDetail: unknown;
}
