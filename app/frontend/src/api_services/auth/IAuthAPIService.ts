import type { AuthResponse } from "../../types/auth/AuthResponse";

export interface RegistrationData {
  username: string;
  password: string;
  email: string;
  name: string;
  surname: string;
  date_of_birth: string;
  gender: string;
  country: string;
  street: string;
  number: string;
}

export interface IAuthAPIService {
  login(username: string, password: string): Promise<AuthResponse>;
  register(data: RegistrationData): Promise<AuthResponse>;
}