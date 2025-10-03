import { ApiResponse } from "../../common/ApiResponse";
import { UserResponse } from "../model/response/user_response";
import {
  makeApiResponse,
  getMockCurrentUser,
  updateMockCurrentUser,
  mockUsers,
  mockUsersById,
} from "./mock_user_data";

class MockUserApi {
  private static instance: MockUserApi;

  public static getInstance(): MockUserApi {
    if (!MockUserApi.instance) {
      MockUserApi.instance = new MockUserApi();
    }
    return MockUserApi.instance;
  }

  private async delay(ms = 180) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async getUserProfile(): Promise<ApiResponse<UserResponse>> {
    await this.delay();
    // return makeApiResponse(getMockCurrentUser(), "OK", true, "200");
    return await this.getUserById(503);
  }

  async updateUserProfile(
    payload: Partial<Omit<UserResponse, "id" | "role">>
  ): Promise<ApiResponse<UserResponse>> {
    await this.delay(220);
    const updated = updateMockCurrentUser(payload);
    return makeApiResponse(updated, "Updated", true, "200");
  }

  async getAllUsers(): Promise<ApiResponse<UserResponse[]>> {
    await this.delay(160);
    return makeApiResponse([...mockUsers], "OK", true, "200");
  }

  async getUserById(id: number): Promise<ApiResponse<UserResponse>> {
    await this.delay(140);
    const me = getMockCurrentUser();
    const found = id === me.id ? me : mockUsersById.get(id);
    if (!found) throw new Error("Mock: user not found");
    return makeApiResponse(found, "OK", true, "200");
  }
}

export const mockUserApi = MockUserApi.getInstance();
