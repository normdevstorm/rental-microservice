import { ApiResponse } from "../../common/ApiResponse";
import { UserRole } from "../../../common/types/enums/enums";
import { UserBasicInfoResponse } from "../model/response/user_basic_info_response";
import { UserResponse } from "../model/response/user_response";

// Small helper to standardize ApiResponse shape
export const makeApiResponse = <T>(
  data: T,
  message = "OK",
  success = true,
  code = "200"
): ApiResponse<T> => ({ data, message, code, success });

// Seed: basic users list
export const mockUsers: UserResponse[] = Array.from({ length: 8 }, (_, i) => {
  const id = 500 + i;
  const isOwner = i % 2 === 0;
  return {
    id,
    name: isOwner ? `Owner ${id}` : `Renter ${id}`,
    email: `${isOwner ? "owner" : "renter"}${id}@example.com`,
    phone: `+84-90${(100 + i).toString()}-${(2000 + i).toString()}`,
    address: [
      "District 1, HCMC",
      "Cau Giay, Hanoi",
      "Binh Thanh, HCMC",
      "Hai Chau, Da Nang",
    ][i % 4],
    role: isOwner ? [UserRole.OWNER] : [UserRole.RENTER],
    isActive: true,
    createdAt: new Date(2024, 6, 1 + i).toISOString(),
  } as UserResponse;
});

export const mockUsersById: Map<number, UserResponse> = new Map(
  mockUsers.map((u) => [u.id, u])
);

// Pretend the logged-in user profile
let currentUser: UserResponse = {
  id: 777,
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+84-901-777-777",
  address: "Thu Duc, HCMC",
  role: [UserRole.RENTER, UserRole.OWNER],
  identityCard: "079123456789",
  avatar: undefined,
  isActive: true,
  licenseNumber: "HCM-XYZ-2024",
  createdAt: new Date(2024, 8, 15).toISOString(),
};

export const getMockCurrentUser = () => currentUser;
export const updateMockCurrentUser = (
  payload: Partial<Omit<UserResponse, "id" | "role">>
): UserResponse => {
  currentUser = { ...currentUser, ...payload };
  return currentUser;
};

export const toBasicInfo = (u: UserResponse): UserBasicInfoResponse => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  address: u.address,
  avatar: u.avatar,
});
