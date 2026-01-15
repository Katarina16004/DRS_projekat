import axios from "axios";
import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";
import type { LoginData } from "../../models/auth/UserLoginDTO";
import type { RegistrationData } from "../../models/auth/UserRegisterDTO";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const authApi: IAuthAPIService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const res = await axios.post<AuthResponse>(`${API_URL}/login`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (error: any) {
      let err: AuthResponse = {};
      if (axios.isAxiosError(error) && error.response) {
        err.error = error.response.data.error || "Unknown error";
      } else {
        err.error = "Server error";
      }
      return err;
    }
  },

  async register(data: RegistrationData): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));

      const res = await axios.post<AuthResponse>(`${API_URL}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (error: any) {
      let err: AuthResponse = {};
      if (axios.isAxiosError(error) && error.response) {
        err.error = error.response.data.error || "Unknown error";
      } else {
        err.error = "Server error";
      }
      return err;
    }
  },
};