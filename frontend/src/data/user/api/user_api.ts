import { axiosInstance } from "../../../common/services/axios";
import { ApiResponse } from "../../common/ApiResponse";
import { UserResponse } from "../model/response/user_response";

class UserApi {
  private static instance: UserApi;

  public static getInstance(): UserApi {
    if (!UserApi.instance) {
      UserApi.instance = new UserApi();
    }
    return UserApi.instance;
  }

  async getUserProfile(): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<UserResponse>>(
        "/auth/users/me"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  async updateUserProfile(
    payload: Partial<Omit<UserResponse, "id" | "role">>
  ): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<UserResponse>>(
        "/auth/users/me",
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
}

export const userApi = UserApi.getInstance();
