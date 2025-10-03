import {
  BookingStatusType,
  PaymentBookingStatusType,
} from "../../../../common/types/enums/enums";
import { ItemResponse } from "../../../item/model/response/item_response";

export interface BookingResponse {
  id: number;
  item: ItemResponse;
  renterId: number;
  startDate: string;
  endDate: string;
  status: BookingStatusType;
  paymentStatus: PaymentBookingStatusType;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt?: string;
}
