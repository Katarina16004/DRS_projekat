import type { LoginData } from "../../models/auth/UserLoginDTO";

export interface LoginErrorState {
  email?: string;
  password?: string;
}

export function validateLogin(data: LoginData): LoginErrorState {
  const errors: LoginErrorState = {};

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Email format is invalid.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  } else if (data.password.length > 20) {
    errors.password = "Password must not be longer than 20 characters.";
  }

  return errors;
}