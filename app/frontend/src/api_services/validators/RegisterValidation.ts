import type { RegistrationData } from "../../models/auth/UserRegisterDTO";

export interface RegistrationErrorState {
  [key: string]: string;
}

export function validateRegistration(form: RegistrationData): RegistrationErrorState {
  const newErrors: RegistrationErrorState = {};

  if (!form.username.trim()) {
    newErrors.username = "Username is required.";
  } else if (form.username.length < 3) {
    newErrors.username = "Username must have at least 3 characters.";
  }

  if (!form.password) {
    newErrors.password = "Password is required.";
  } else if (form.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters.";
  }

  if (!form.first_name.trim()) {
    newErrors.first_name = "First name is required.";
  }

  if (!form.last_name.trim()) {
    newErrors.last_name = "Last name is required.";
  }

  if (!form.birth_date) {
    newErrors.birth_date = "Date of birth is required.";
  }

  if (!form.gender) {
    newErrors.gender = "Gender is required.";
  }

  if (!form.email) {
    newErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = "Email format is invalid.";
  }

  if (!form.country.trim()) {
    newErrors.country = "Country is required.";
  }

  if (!form.street.trim()) {
    newErrors.street = "Street is required.";
  }

  if (!form.street_number.trim()) {
    newErrors.street_number = "Street number is required.";
  } else if (isNaN(Number(form.street_number))) {
    newErrors.street_number = "Street number must be a valid number.";
  }

  return newErrors;
}