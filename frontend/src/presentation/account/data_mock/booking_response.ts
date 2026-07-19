import {
  BookingStatusType,
  PaymentBookingStatusType,
} from "../../../common/types/enums/enums";

export interface BookingResponse {
  bookingId: number;
  itemId: number;
  renterId: number;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  depositAmount: number;
  status: BookingStatusType;
  paymentStatus: PaymentBookingStatusType;
  notes?: string;
  cancellationReason?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
