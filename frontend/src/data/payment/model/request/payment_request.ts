import { PaymentBookingStatusType } from "../../../../common/types/enums/enums";

export interface PaymentRequest {
  bookingId: number;
  paymentType: PaymentBookingStatusType;
}
