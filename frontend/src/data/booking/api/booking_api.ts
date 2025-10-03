import { axiosInstance } from "../../../common/services/axios";
import {
  BookingStatusType,
  PaymentBookingStatusType,
  PaymentKindType,
  PaymentProcessStatusType,
} from "../../../common/types/enums/enums";
import { ApiResponse } from "../../common/ApiResponse";
import { CreateBookingRequest } from "../model/request/create_booking_request";
import { BookingResponse } from "../model/response/booking_owner_response";
import { mockBookingApi } from "./mock_booking_api";

class BookingApi {
  private static instance: BookingApi;

  public static getInstance(): BookingApi {
    if (!BookingApi.instance) {
      BookingApi.instance = new BookingApi();
    }
    return BookingApi.instance;
  }

  async createBooking(
    createBookingRequest: CreateBookingRequest
  ): Promise<ApiResponse<BookingResponse>> {
    try {
      // if (process.env.REACT_APP_USE_MOCK === "true") {
      //   return await mockBookingApi.createBooking(createBookingRequest);
      // }
      const response = await axiosInstance.post<ApiResponse<BookingResponse>>(
        "/bookings",
        createBookingRequest
      );
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

  async getBookingById(
    bookingId: number
  ): Promise<ApiResponse<BookingResponse>> {
    try {
      // if (process.env.REACT_APP_USE_MOCK === "true") {
      //   return await mockBookingApi.getBookingById(bookingId);
      // }
      const response = await axiosInstance.get<ApiResponse<BookingResponse>>(
        `/bookings/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      throw error;
    }
  }

  // get bookings that the current user has made as a renter
  async getAllBookingsByRenter(): Promise<ApiResponse<BookingResponse[]>> {
    try {
      // if (process.env.REACT_APP_USE_MOCK === "true") {
      //   return await mockBookingApi.getAllBookingsByRenter();
      // }
      const response = await axiosInstance.get<ApiResponse<BookingResponse[]>>(
        `/bookings/renter`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings by renter:", error);
      throw error;
    }
  }
  // get bookings for items that the current user owns
  // TODO: need to get renter info -> define new response model if needed
  async getAllBookingsByOwner(
    ownerId: number
  ): Promise<ApiResponse<BookingResponse[]>> {
    try {
      // if (process.env.REACT_APP_USE_MOCK === "true") {
      //   return await mockBookingApi.getAllBookingsByOwner();
      // }
      const response = await axiosInstance.get<ApiResponse<BookingResponse[]>>(
        `/bookings/owner/${ownerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings by owner:", error);
      throw error;
    }
  }

  async updateBookingInfo(
    bookingId: number,
    newBookingStatus?: BookingStatusType,
    newPaymentStatus?: PaymentBookingStatusType
  ): Promise<ApiResponse<BookingResponse>> {
    try {
      // if (process.env.REACT_APP_USE_MOCK === "true") {
      //   return await mockBookingApi.updateBookingStatus(bookingId, newStatus);
      // }
      const response = await axiosInstance.put<ApiResponse<BookingResponse>>(
        `/bookings/${bookingId}`,
        { status: newBookingStatus, paymentStatus: newPaymentStatus }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  }
}
export const bookingApi = BookingApi.getInstance();
