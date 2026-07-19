import { axiosInstance } from "../../../common/services/axios";
import localStorageService from "../../../common/services/localStorageService";
import type { ApiResponse } from "../../common/ApiResponse";
import type { LoginRequest } from "../model/request/login_request";
import { SignUpRequest } from "../model/request/signup_request";
import type { LoginResponse } from "../model/response/login_response";
import { SignUpResponse } from "../model/response/singup_response";

class AuthApi {
  private static instance: AuthApi;

  public static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi();
    }
    return AuthApi.instance;
  }

  async login(
    LoginRequestModel: LoginRequest
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
        "/auth/signin",
        LoginRequestModel
      );
      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  }

  async signup(payload: SignUpRequest): Promise<ApiResponse<SignUpResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<SignUpResponse>>(
        "/auth/signup",
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Signup API error:", error);
      throw error;
    }
  }

  async logout(): Promise<ApiResponse<string>> {
    try {
      // await axiosInstance.post("/auth/logout");
      const response = await axiosInstance.post<ApiResponse<string>>(
        "/auth/logoutone",
        {
          refreshToken: localStorageService.getLocalStorage("refreshToken"),
          deviceId: localStorageService.getLocalStorage("fcmToken"),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Logout API error:", error);
      throw error;
    }
  }

  async refreshToken(
    refresh_token: string
  ): Promise<ApiResponse<LoginResponse> | null> {
    try {
      const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
        "/auth/refresh",
        {
          refreshToken: refresh_token,
          deviceId: localStorageService.getLocalStorage("fcmToken"),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Refresh Token API error:", error);
      return null;
    }
  }

  async validateToken(): Promise<ApiResponse<boolean> | null> {
    try {
      const token = localStorageService.getLocalStorage("accessToken");
      if (!token) {
        return null;
      }
      const response = await axiosInstance.post<ApiResponse<boolean>>(
        "/auth/validate-token",
        { token: token }
      );
      return response.data;
    } catch (error) {
      console.error("Validate Token API error:", error);
      return null;
    }
  }
}

export const authApi = AuthApi.getInstance();
