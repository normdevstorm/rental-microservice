import { ItemCategoryType } from "../../../../common/types/enums/enums";
import { UserResponse } from "../../../user/model/response/user_response";

export interface ItemCommonModel {
  id?: number;
  // owner?: UserResponse;
  name: string;
  description?: string;
  price: number;
  itemValue: number;
  latePrice: number;
  depositAmount: number;
  address: string;
  category: ItemCategoryType;
  createdAt?: string;
}
