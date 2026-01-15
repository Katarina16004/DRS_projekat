import type { UserRole } from "../../enums/user/UserRole";
export interface User {
  ID_User: number;
  email: string;
  username: string;
  role: UserRole;
}