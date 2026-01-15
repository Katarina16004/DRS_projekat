import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { LoginData } from "../../models/auth/UserLoginDTO";
import type { RegistrationData } from "../../models/auth/UserRegisterDTO";

export interface IAuthAPIService {
  login(data: LoginData): Promise<AuthResponse>;
  register(data: RegistrationData): Promise<AuthResponse>;
}