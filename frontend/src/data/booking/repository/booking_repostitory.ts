import {
  BookingStatusType,
  PaymentBookingStatusType,
} from "../../../common/types/enums/enums";
import { bookingApi } from "../api/booking_api";
import { mockBookingApi } from "../api/mock_booking_api";
import { CreateBookingRequest } from "../model/request/create_booking_request";
import { BookingResponse } from "../model/response/booking_owner_response";
class BookingRepository {
  private static instance: BookingRepository;

  public static getInstance(): BookingRepository {
    if (!BookingRepository.instance) {
      BookingRepository.instance = new BookingRepository();
    }
    return BookingRepository.instance;
  }

  async createBooking(
    createBookingRequest: CreateBookingRequest
  ): Promise<BookingResponse> {
    const response = await bookingApi.createBooking(createBookingRequest);
    return response.data;
  }

  async getBookingById(bookingId: number): Promise<BookingResponse> {
    const response = await bookingApi.getBookingById(bookingId);
    return response.data;
  }

  async getAllBookingsByRenter(): Promise<BookingResponse[]> {
    const response = await bookingApi.getAllBookingsByRenter();
    return response.data;
  }

  async getAllBookingsByOwner(ownerId: number): Promise<BookingResponse[]> {
    /// TODO: replace with authentic api call when backend is ready
    const response = await bookingApi.getAllBookingsByOwner(ownerId);
    return response.data;
  }

  async updateBookingInfo({
    bookingId,
    status,
    paymentStatus,
  }: {
    bookingId: number;
    status?: BookingStatusType;
    paymentStatus?: PaymentBookingStatusType;
  }): Promise<BookingResponse> {
    try {
      const response = await bookingApi.updateBookingInfo(
        bookingId,
        status,
        paymentStatus
      );
      return response.data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  }
  // async updateBookingPaymentStatus(
  //   bookingId: number,
  //   paymentStatus: PaymentBookingStatusType
  // ): Promise<BookingResponse> {
  //   /// TODO: replace with authentic api call when backend is ready
  //   try {
  //     const response = await bookingApi.updateBookingPaymentStatus(
  //       bookingId,
  //       paymentStatus
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error updating booking status:", error);
  //     throw error;
  //   }
  // }
}

export const bookingRepository = BookingRepository.getInstance();
