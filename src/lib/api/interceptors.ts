import { sanitizeApiError, ApiError, parseValidationErrors, ApiErrorPayload } from "./errors";

export type SessionExpiredCallback = () => void;

let sessionExpiredHandler: SessionExpiredCallback | null = null;

export function registerSessionExpiredHandler(handler: SessionExpiredCallback) {
  sessionExpiredHandler = handler;
}

export function unregisterSessionExpiredHandler() {
  sessionExpiredHandler = null;
}

/**
 * Applies security headers and bearer authorization to outgoing requests.
 * Never logs the token or authorization headers.
 */
export function applyRequestInterceptors(
  headers: Record<string, string>,
  token: string | null
): Record<string, string> {
  const enhanced: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (token && !enhanced["Authorization"]) {
    enhanced["Authorization"] = `Bearer ${token}`;
  }

  return enhanced;
}

/**
 * Handles API responses, centrally catching 401 Unauthorized, 403 Forbidden, and structured errors.
 */
export async function handleResponseInterceptors<T>(
  response: Response,
  endpoint: string
): Promise<T> {
  // Handle empty responses cleanly (204 No Content, 205 Reset Content)
  if (response.status === 204 || response.status === 205) {
    return {} as T;
  }

  if (!response.ok) {
    let rawMessage = response.statusText || `Request failed with status ${response.status}`;
    let errors: Record<string, string> | null = null;
    let payload: Partial<ApiErrorPayload> = {
      status: response.status,
      path: endpoint,
    };

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorJson = await response.json();
        rawMessage = errorJson.message || errorJson.error || rawMessage;
        errors = parseValidationErrors(errorJson);
        payload = {
          status: response.status,
          message: rawMessage,
          timestamp: errorJson.timestamp,
          path: errorJson.path || endpoint,
          errors,
        };
      } else {
        const text = await response.text();
        if (text && text.length < 300) {
          rawMessage = text;
        }
      }
    } catch {
      // Body could not be read or parsed
    }

    // Centrally trigger session expiration on 401 (avoiding loops on authentication endpoints)
    if (
      response.status === 401 &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/register")
    ) {
      if (sessionExpiredHandler) {
        sessionExpiredHandler();
      }
    }

    const sanitizedMessage = sanitizeApiError(response.status, rawMessage);
    throw new ApiError(response.status, sanitizedMessage, errors, payload);
  }

  // Check if response contains body content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }

  // Non-JSON or empty response
  const text = await response.text();
  return (text ? (text as unknown as T) : ({} as T));
}

