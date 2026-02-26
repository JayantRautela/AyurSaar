import { apiRequest } from "./api";

export const authService = {
  signup: (name: string, email: string, password: string) => apiRequest("/api/v1/user/register", "POST", { name, email, password }),

  login: (email: string, password: string) => apiRequest("/api/v1/user/login", "POST", { email, password }),

  getMe: (token: string) => apiRequest("/api/v1/user/get-user", "GET", undefined, token),
};