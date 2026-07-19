import { ItemResponse } from "../../../item/model/response/item_response";
import { UserBasicInfoResponse } from "../../../user/model/response/user_basic_info_response";

export interface BookingResponse {
  id: number;
  item: ItemResponse;
  renter: UserBasicInfoResponse;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt?: string;
}
