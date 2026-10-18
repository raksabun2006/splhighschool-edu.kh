import { UserRole, AuthUser, AppPermission } from "@/types/auth";

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password?: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  // Role is optional for public self-registration (defaults to STUDENT on backend)
  role?: "STUDENT" | "TEACHER" | "PARENT" | "STAFF";
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  email: string;
  role: UserRole;
  fullName?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<AuthUser | null>;
  hasPermission: (permission: AppPermission) => boolean;
}
