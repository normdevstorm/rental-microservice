import { UserRoleType } from "../../../../common/types/enums/enums";

export interface SignUpRequest {

  password: string;
  role: UserRoleType[];
  name: string;
  phoneNumber?: string;
  email: string;
}
