/**
 * Secure Token Storage Adapter
 *
 * Keeps access tokens in memory for active runtime operations and backs up
 * to sessionStorage/localStorage only as necessary for page refresh persistence.
 * Never stores passwords or unhashed secrets.
 */

const TOKEN_KEY = "educore_token";

let inMemoryToken: string | null = null;

export function getAuthToken(): string | null {
  if (inMemoryToken) {
    return inMemoryToken;
  }

  if (typeof window !== "undefined") {
    // Check sessionStorage first, then fallback to localStorage
    const stored =
      window.sessionStorage.getItem(TOKEN_KEY) ||
      window.localStorage.getItem(TOKEN_KEY);
    if (stored) {
      inMemoryToken = stored;
      return stored;
    }
  }

  return null;
}

export function setAuthToken(token: string) {
  if (!token) return;
  inMemoryToken = token;

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Storage unavailable or quota exceeded
    }
  }
}

export function removeAuthToken() {
  inMemoryToken = null;

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem("educore_user");
      window.localStorage.removeItem("educore_user_profile");
      window.localStorage.removeItem("educore_active_role");
    } catch {
      // ignore
    }
  }
}

export function hasAuthToken(): boolean {
  return Boolean(getAuthToken());
}
