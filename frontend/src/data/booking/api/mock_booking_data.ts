import { ApiResponse } from "../../common/ApiResponse";
import {
  BookingStatus,
  BookingStatusType,
  PaymentBookingStatus,
  PaymentBookingStatusType,
  UserRole,
} from "../../../common/types/enums/enums";
import { ItemResponse } from "../../item/model/response/item_response";
// ❌ Bỏ import BookingResponse nếu không còn dùng
// import { BookingResponse } from "../model/response/booking_response";
import { BookingResponse } from "../model/response/booking_owner_response";
import { UserBasicInfoResponse } from "../../user/model/response/user_basic_info_response";
import { UserResponse } from "../../user/model/response/user_response";
import { mockAllItems } from "../../item/api/mock_item_data";

// Small helper to standardize ApiResponse shape
export const makeApiResponse = <T>(
  data: T,
  message = "OK",
  success = true,
  code = "200"
): ApiResponse<T> => ({ data, message, code, success });

const iso = (d: Date) => d.toISOString();
const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Mock users (basic info) to be used as renters
export const mockRenterUsers: UserBasicInfoResponse[] = Array.from(
  { length: 12 },
  (_, i) => {
    const id = 1001 + i;
    return {
      id,
      name: `Renter ${id}`,
      email: `renter${id}@example.com`,
      phone: `+84-9${(id % 1000).toString().padStart(3, "0")}-000${i % 10}`,
      address: [
        "District 1, HCMC",
        "Cau Giay, Hanoi",
        "Thu Duc, HCMC",
        "Hai Ba Trung, Hanoi",
      ][i % 4],
      avatar: undefined,
    } as UserBasicInfoResponse;
  }
);

// Mock owners (ids only, used to map items to owners)
export const mockOwnerIds: number[] = [501, 502, 503, 504, 505];

export const ownerIdForItem = (itemId: number) =>
  mockOwnerIds[itemId % mockOwnerIds.length];

// Helper to pick an ItemResponse by id from item mocks
export const getItemById = (itemId: number): ItemResponse | undefined =>
  mockAllItems.find((i) => i.id === itemId);

// Mock owners - full UserResponse for attaching to items
export const mockOwners: UserResponse[] = mockOwnerIds.map((id, idx) => ({
  id,
  name: `Owner ${id}`,
  email: `owner${id}@example.com`,
  phone: `+84-90${(700 + idx).toString()}-${(1000 + idx).toString()}`,
  address: [
    "District 3, HCMC",
    "Dong Da, Hanoi",
    "Binh Thanh, HCMC",
    "Hai Chau, Da Nang",
    "Thu Duc, HCMC",
  ][idx % 5],
  role: [UserRole.OWNER],
  isActive: true,
  createdAt: new Date(2024, 0, 1 + idx).toISOString(),
}));

export const mockOwnersById: Map<number, UserResponse> = new Map(
  mockOwners.map((o) => [o.id, o])
);

export const withOwner = (item: ItemResponse): ItemResponse => {
  const owner = mockOwnersById.get(ownerIdForItem(item.id));
  return owner ? { ...item, owner } : item;
};

// Index renters by id (vẫn giữ để tái sử dụng khi cần)
export const rentersById: Map<number, UserBasicInfoResponse> = new Map(
  mockRenterUsers.map((u) => [u.id, u])
);

// === CHÍNH: Sinh mock bookings trực tiếp ở dạng BookingOwnerResponse ===
const today = new Date();

const seedBookings = (): BookingResponse[] => {
  const items = mockAllItems.slice(0, 25); // use first 25 items
  const statuses: BookingStatusType[] = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.CANCELLED,
    BookingStatus.COMPLETED,
    BookingStatus.NEGOTIATION,
  ];
  const payStatuses: PaymentBookingStatusType[] = [
    PaymentBookingStatus.INITIAL,
    PaymentBookingStatus.DEPOSIT_PAID,
    PaymentBookingStatus.RENTAL_PAID,
    PaymentBookingStatus.DEPOSIT_REFUNDED,
    PaymentBookingStatus.FULLY_PAID,
  ];

  let idCounter = 10001;
  const list: BookingResponse[] = [];

  // Các booking quá khứ/gần đây
  for (let idx = 0; idx < items.length; idx++) {
    const item = withOwner(items[idx]);
    const renter = mockRenterUsers[idx % mockRenterUsers.length];
    const start = addDays(today, -idx - 1);
    const end = addDays(start, 3 + (idx % 5));
    const created = addDays(start, -2);
    const updated = addDays(created, 1 + (idx % 3));

    list.push({
      id: idCounter++,
      item,
      renter, // ✅ owner-view: có renter object thay vì renterId
      startTime: iso(start),
      endTime: iso(end),
      status: statuses[idx % statuses.length],
      paymentStatus: payStatuses[idx % payStatuses.length],
      notes:
        idx % 4 === 0
          ? "Customer asks for early pickup"
          : idx % 4 === 1
          ? "Deliver to doorstep"
          : undefined,
      cancellationReason:
        idx % 7 === 0 ? "Customer changed schedule" : undefined,
      createdAt: iso(created),
      updatedAt: iso(updated),
    });
  }

  // Các booking tương lai
  for (let k = 0; k < 15; k++) {
    const item = withOwner(mockAllItems[(k + 7) % mockAllItems.length]);
    const renter = mockRenterUsers[(k + 5) % mockRenterUsers.length];
    const start = addDays(today, 5 + k);
    const end = addDays(start, 2 + (k % 4));
    const created = addDays(today, 1 + (k % 3));
    const updated = addDays(created, 1);

    const status =
      k % 3 === 0 ? BookingStatus.PENDING : BookingStatus.CONFIRMED;
    const paymentStatus =
      k % 3 === 0
        ? PaymentBookingStatus.INITIAL
        : PaymentBookingStatus.DEPOSIT_PAID;

    list.push({
      id: idCounter++,
      item,
      renter, // ✅
      startTime: iso(start),
      endTime: iso(end),
      status,
      paymentStatus,
      createdAt: iso(created),
      updatedAt: iso(updated),
    });
  }

  return list;
};

// ✅ Mock bookings giờ là BookingOwnerResponse[]
export const mockBookings: BookingResponse[] = seedBookings();

// ✅ Indexers and helpers
export const mockBookingsById: Map<number, BookingResponse> = new Map(
  mockBookings.map((b) => [b.id, b])
);

// (Tuỳ chọn) helper cho legacy code cần renterId
export const getRenterId = (b: BookingResponse) => b.renter?.id;

// ✅ Filter theo owner dùng luôn dữ liệu owner-view
export const filterBookingsByOwner = (ownerId: number): BookingResponse[] =>
  mockBookings.filter(
    (b) => b.item.owner?.id === ownerId || ownerIdForItem(b.item.id) === ownerId
  );
