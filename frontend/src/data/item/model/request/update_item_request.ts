import {
  AvailabilityStatusType,
  ItemCategoryType,
} from "../../../../common/types/enums/enums";

export interface UpdateItemRequest<T = any> {
  id: number,
  availabilityStatus?: AvailabilityStatusType;
}
