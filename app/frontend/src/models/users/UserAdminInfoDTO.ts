import type { UserRole } from "../../enums/user/UserRole";

export interface UserAdminDTO {
  id: number;
  name: string | null;
  surname: string | null;
  username: string;
  role: UserRole;
  avatarUrl?: string;
  dateOfBirth: string | null;
  gender: string | null;
  email: string;
  country: string | null;
  street: string | null;
  number: string | null;
}