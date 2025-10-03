import { ApiResponse } from "../../common/ApiResponse";
import { CreateBookingRequest } from "../model/request/create_booking_request";
import { BookingResponse } from "../model/response/booking_owner_response";
import {
  BookingStatusType,
  PaymentBookingStatusType,
} from "../../../common/types/enums/enums";
import {
  makeApiResponse,
  mockBookings,
  mockBookingsById,
  getItemById,
  filterBookingsByOwner,
} from "./mock_booking_data";

class MockBookingApi {
  private static instance: MockBookingApi;

  public static getInstance(): MockBookingApi {
    if (!MockBookingApi.instance) {
      MockBookingApi.instance = new MockBookingApi();
    }
    return MockBookingApi.instance;
  }

  private async delay(ms = 250) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async createBooking(
    createBookingRequest: CreateBookingRequest
  ): Promise<ApiResponse<BookingResponse>> {
    await this.delay(200);
    const newId = Math.max(...mockBookings.map((b) => b.id)) + 1;
    const item = getItemById(createBookingRequest.itemId);
    if (!item) throw new Error("Mock: item not found");
    const now = new Date().toISOString();
    const booking: BookingResponse = {
      id: newId,
      item,
      renterId: 1001, // default mock renter
      startDate: createBookingRequest.startTime,
      endDate: createBookingRequest.endTime,
      status: "PENDING" as BookingStatusType,
      paymentStatus: "INITIAL",
      createdAt: now,
      updatedAt: now,
    } as any;
    mockBookings.push(booking);
    mockBookingsById.set(newId, booking);
    return makeApiResponse(booking, "Mock created", true, "200");
  }

  async getBookingById(
    bookingId: number
  ): Promise<ApiResponse<BookingResponse>> {
    await this.delay(150);
    const found = mockBookingsById.get(bookingId);
    if (!found) throw new Error("Mock: booking not found");
    return makeApiResponse(found, "OK", true, "200");
  }

  async getAllBookingsByRenter(): Promise<ApiResponse<BookingResponse[]>> {
    await this.delay(180);
    const list = mockBookings.filter((b) => b.renter?.id === 1002);
    return makeApiResponse([...list], "OK", true, "200");
  }

  async getAllBookingsByOwner(): Promise<ApiResponse<BookingResponse[]>> {
    await this.delay(180);
    const list = filterBookingsByOwner(503);
    return makeApiResponse(list, "OK", true, "200");
  }

  async updateBookingStatus(
    bookingId: number,
    newStatus: BookingStatusType
  ): Promise<ApiResponse<BookingResponse>> {
    await this.delay(150);
    const found = mockBookingsById.get(bookingId);
    if (!found) throw new Error("Mock: booking not found");
    found.status = newStatus;
    found.updatedAt = new Date().toISOString();
    return makeApiResponse(found, "Status updated", true, "200");
  }
  async updateBookingPaymentStatus(
    bookingId: number,
    newPaymentStatus: PaymentBookingStatusType
  ): Promise<ApiResponse<BookingResponse>> {
    await this.delay(150);
    const found = mockBookingsById.get(bookingId);
    if (!found) throw new Error("Mock: booking not found");
    found.paymentStatus = newPaymentStatus;
    found.updatedAt = new Date().toISOString();
    return makeApiResponse(found, "Payment status updated", true, "200");
  }
}

export const mockBookingApi = MockBookingApi.getInstance();
