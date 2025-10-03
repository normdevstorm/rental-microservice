import { mockUserApi } from "../api/mock_user_api";
import { userApi } from "../api/user_api";
import { UserResponse } from "../model/response/user_response";

class UserRepository {
  private static instance: UserRepository;

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async getUserProfile(): Promise<UserResponse> {
    const response = await userApi.getUserProfile();
    return response.data;
  }

  async updateUserProfile(
    payload: Partial<Omit<UserResponse, "id" | "role">>
  ): Promise<UserResponse> {
    const response = await userApi.updateUserProfile(payload);
    return response.data;
  }
}

export const userRepository = UserRepository.getInstance();
