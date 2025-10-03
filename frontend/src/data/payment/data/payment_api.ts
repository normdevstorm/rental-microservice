import { axiosInstance } from "../../../common/services/axios";
import { ApiResponse } from "../../common/ApiResponse";

class PaymentApi {
  private static instance: PaymentApi;

  public static getInstance(): PaymentApi {
    if (!PaymentApi.instance) {
      PaymentApi.instance = new PaymentApi();
    }
    return PaymentApi.instance;
  }

  async depositPayment(
    bookingId: number
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<PaymentResponse>>(
        "/payment/deposit",
        { bookingId }
      );
      return response.data;
    } catch (error) {
      console.error("Error processing deposit payment:", error);
      throw error;
    }
  }
  async rentingFeePayment(
    bookingId: number
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<PaymentResponse>>(
        "/payment/renting-fee",
        { bookingId }
      );
      return response.data;
    } catch (error) {
      console.error("Error processing renting fee payment:", error);
      throw error;
    }
  }
  // refund payment should be scheduled job on backend
}
