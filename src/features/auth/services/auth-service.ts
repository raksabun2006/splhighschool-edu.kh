import { apiClient } from "@/lib/api/client";
import { setAuthToken, removeAuthToken } from "@/lib/auth/token-storage";
import { AuthResponse, LoginCredentials, RegisterData } from "../types";
import { AuthUser } from "@/types/auth";

export const authService = {
  /**
   * Authenticates user with Spring Boot backend /api/v1/auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      email: credentials.email.trim(),
      password: credentials.password,
    });

    if (response.accessToken) {
      setAuthToken(response.accessToken);
    }

    return response;
  },

  /**
   * Public registration accepting only permitted fields (never ADMIN)
   */
  async register(data: RegisterData): Promise<AuthUser> {
    // Sanitize input
    const payload = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      password: data.password,
      sex: data.sex,
      // Default to STUDENT if not provided; never allow ADMIN
      role: data.role === "STAFF" || data.role === "TEACHER" || data.role === "PARENT"
        ? data.role
        : "STUDENT",
    };

    return apiClient.post<AuthUser>("/auth/register", payload);
  },

  /**
   * Fetches current authenticated user profile from /api/v1/auth/me
   */
  async getMe(): Promise<AuthUser> {
    return apiClient.get<AuthUser>("/auth/me");
  },

  /**
   * Clears local authentication tokens and session
   */
  logout(): void {
    removeAuthToken();
  },
};

