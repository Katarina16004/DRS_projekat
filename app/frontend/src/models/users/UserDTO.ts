import type { Gender } from "../../enums/gender/Gender";
import type { UserRole } from "../../enums/user/UserRole";

export interface UserDTO {
  id: string | number;
  username: string;
  name: string;
  surname: string;
  date_of_birth: string;
  gender: Gender;
  email: string;
  country: string;
  street: string;
  number: string;
  role: UserRole;
  avatarUrl?: string;
}