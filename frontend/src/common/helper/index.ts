import { message } from "antd";
import {
  PaymentBookingStatus,
  PaymentBookingStatusType,
} from "../types/enums/enums";

export const getErrorMessage = (error: any) => {
  return error?.response?.data?.data[0].message || "Something went wrong!";
};

export const handleErrorMessage = (error: any, messageText?: string) => {
  message.config({
    top: 80,
    prefixCls: "zm-ant-message",
  });
  message.destroy();
  message.error(messageText || getErrorMessage(error));
};

export const handleSuccessMessage = (messageText: string) => {
  message.config({
    top: 80,
    prefixCls: "zm-ant-message",
  });
  message.destroy();
  message.success(messageText);
};

export const handleErrorMessageWithI18n = (errorCode: string) => {
  message.config({
    top: 80,
    prefixCls: "zm-ant-message",
  });
  message.destroy();
  message.error(errorCode);
};

export const convertStringToDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const convertPaymentStatusTypeToString = (
  paymentStatus: PaymentBookingStatusType | string
): string => {
  switch (paymentStatus) {
    case PaymentBookingStatus.DEPOSIT_PAID:
      return "Deposit paid";

    case PaymentBookingStatus.RENTAL_PAID:
      return "Rental paid";
    case PaymentBookingStatus.DEPOSIT_REFUNDED:
      return "Deposit refunded";
    case PaymentBookingStatus.FULLY_PAID:
      return "Fully paid";
    case PaymentBookingStatus.INITIAL:
    default:
      return "Initial";
  }
};

export const toUtcMidnightISO = (d: Date): string => {
  const y = d.getFullYear();
  const m = d.getMonth(); // 0-based
  const day = d.getDate();
  return new Date(Date.UTC(y, m, day, 0, 0, 0, 0)).toISOString(); // "YYYY-MM-DDT00:00:00.000Z"
};

export const toUtcMidnight = (d: Date): string => {
  const y = d.getFullYear();
  const m = d.getMonth(); // 0-based
  const day = d.getDate();
  const iso = new Date(Date.UTC(y, m, day, 0, 0, 0, 0)).toISOString();
  return iso.replace(/Z$/, ""); // "YYYY-MM-DDT00:00:00.000"
};
