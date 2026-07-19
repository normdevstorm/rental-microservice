import { UserRoleType } from "../../../../common/types/enums/enums";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: UserRoleType[];
  identityCard?: string;
  avatar?: string;
  isActive?: boolean;
  licenseNumber?: string;
  createdAt?: string;
}
