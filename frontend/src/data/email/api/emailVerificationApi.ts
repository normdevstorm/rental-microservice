import { axiosInstance } from "../../../common/services/axios";
import type { ApiResponse } from "../../common/ApiResponse";
import { VerifyEmailRequest } from "../model/request/verify_email_request";
import type { VerifyEmailResponse } from "../model/response/verify_email_response";

class EmailVerificationApi {
  private static instance: EmailVerificationApi;

  public static getInstance() {
    if (!EmailVerificationApi.instance) {
      EmailVerificationApi.instance = new EmailVerificationApi();
    }
    return EmailVerificationApi.instance;
  }

  
async verify(payload: VerifyEmailRequest): Promise<ApiResponse<VerifyEmailResponse>> {
  try {
    const params = new URLSearchParams();
    params.append("email", payload.email);
    params.append("code", payload.code);
    const res = await axiosInstance.post<ApiResponse<VerifyEmailResponse>>(
      "/mail/verify-code",
      null,
      {params: params  }
    );
    return res.data;
  } catch (error) {
    console.error("Verify Email API error:", error);
    throw error;
  }
}

  async send(email: string): Promise<ApiResponse<void>> {
    try {
      const params = new URLSearchParams();
      params.append("email", email);
      const res = await axiosInstance.post<ApiResponse<void>>(
        "/mail/send-verification-code",
        null,
       {params: params  }
      );
      return res.data;
    } catch (error) {
      console.error("Send Verification Code API error:", error);
      throw error;
    }
  }
}

export const emailVerificationApi = EmailVerificationApi.getInstance();
