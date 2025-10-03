import {
  PaymentKindType,
  PaymentProcessStatusType,
} from "../../../../common/types/enums/enums";

export interface PaymentResponse {
  id: number;
  bookingId: number;
  amount: number;
  paymentType: PaymentKindType;
  status: PaymentProcessStatusType;
}
