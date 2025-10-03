export const ItemCategory = {
  CAR: "CAR",
  MOTORBIKE: "MOTORBIKE",
  ALL: "ALL",
} as const;

export const AvailabilityStatus = {
  AVAILABLE: "AVAILABLE",
  MAINTENANCE: "MAINTENANCE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export const UserRole = {
  OWNER: "OWNER",
  RENTER: "RENTER",
  ADMIN: "ADMIN",
} as const;

export const StateStatus = {
  INITIAL: "INITIAL",
  LOADING: "LOADING",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
} as const;

export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  NEGOTIATION: "NEGOTIATION",
} as const;

export const PaymentBookingStatus = {
  INITIAL: "INITIAL",
  DEPOSIT_PAID: "DEPOSIT_PAID",
  RENTAL_PAID: "RENTAL_PAID",
  DEPOSIT_REFUNDED: "DEPOSIT_REFUNDED",
  FULLY_PAID: "FULLY_PAID",
} as const;

export const PaymentKind = {
  DEPOSIT: "DEPOSIT",
  RENTAL_PAYMENT: "RENTAL_PAYMENT",
  DEPOSIT_REFUND: "REPOSIT_REFUND",
  FINAL_PAYMENT: "FINAL_PAYMENT",
} as const;

export const PaymentProcessStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export const ImagePriority = {
  MAIN: "MAIN",
  EXTRA: "EXTRA",
  // Newly added priority for item certificate / document images
  DOCUMENT: "DOCUMENT",
} as const;

export const FuelEnum = {
  PETROL: "PETROL",
  DIESEL: "DIESEL",
  ELECTRIC: "ELECTRIC",
  HYBRID: "HYBRID",
} as const;

export const AccountSideBarTab = {
  MY_PROFILE: "MY_PROFILE",
  MY_BOOKING: "MY_BOOKING",
  MY_ITEMS: "MY_ITEMS",
  LOG_OUT: "LOG_OUT",
} as const;

export type AccountSideBarType =
  (typeof AccountSideBarTab)[keyof typeof AccountSideBarTab];

export const TransmissionEnum = {
  MANUAL: "MANUAL",
  AUTOMATIC: "AUTOMATIC",
} as const;

export type TransmissionEnumType =
  (typeof TransmissionEnum)[keyof typeof TransmissionEnum];
export type PaymentKindType = (typeof PaymentKind)[keyof typeof PaymentKind];

export type PaymentProcessStatusType =
  (typeof PaymentProcessStatus)[keyof typeof PaymentProcessStatus];

export type FuelType = (typeof FuelEnum)[keyof typeof FuelEnum];

export type ImagePriorityType =
  (typeof ImagePriority)[keyof typeof ImagePriority];

export type PaymentBookingStatusType =
  (typeof PaymentBookingStatus)[keyof typeof PaymentBookingStatus];
export type BookingStatusType =
  (typeof BookingStatus)[keyof typeof BookingStatus];

// Type utilities - use these when you need just the type
export type ItemCategoryType = (typeof ItemCategory)[keyof typeof ItemCategory];
export type AvailabilityStatusType =
  (typeof AvailabilityStatus)[keyof typeof AvailabilityStatus];
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export type StateStatusType = (typeof StateStatus)[keyof typeof StateStatus];
