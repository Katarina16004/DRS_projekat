import type { AuthResponse } from "../../types/auth/AuthResponse";

export interface RegistrationData {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  country: string;
  street: string;
  street_number: string;
}

export interface IAuthAPIService {
  login(email: string, password: string): Promise<AuthResponse>;
  register(data: RegistrationData): Promise<AuthResponse>;
}