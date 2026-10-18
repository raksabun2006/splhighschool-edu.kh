import { applyRequestInterceptors, handleResponseInterceptors, registerSessionExpiredHandler, unregisterSessionExpiredHandler } from "./interceptors";
import { getAuthToken } from "@/lib/auth/token-storage";
import { ApiError } from "./errors";

export { ApiError, isApiError } from "./errors";
export type { ApiErrorPayload } from "./errors";
export { registerSessionExpiredHandler, unregisterSessionExpiredHandler };

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://educorekh-api-production.up.railway.app/api/v1";

/**
 * Spring Data Sort metadata
 */
export interface SortInfo {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

/**
 * Spring Data Pageable metadata
 */
export interface PageableInfo {
  pageNumber: number;
  pageSize: number;
  sort?: SortInfo;
  offset?: number;
  paged?: boolean;
  unpaged?: boolean;
}

/**
 * Full Spring Boot Page<T> response structure
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements?: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  pageable?: PageableInfo;
  sort?: SortInfo;
}

/**
 * Standard pagination and sorting query parameters
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string | string[];
}

/**
 * Supported query parameter values
 */
export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | (string | number | boolean)[];

export type QueryParams = Record<string, QueryParamValue>;

/**
 * Enhanced request configuration options
 */
export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  params?: QueryParams;
  json?: unknown;
  body?: BodyInit | null;
  timeout?: number;
  token?: string | null;
  skipAuth?: boolean;
}

/**
 * Converts a query parameters object into a clean URL query string.
 * Strips undefined, null, and empty string values.
 */
export function buildQueryString(params?: QueryParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null && item !== "") {
          searchParams.append(key, String(item));
        }
      }
    } else {
      searchParams.set(key, String(value));
    }
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Normalizes backend URL paths to ensure no duplicate /api or /api/v1 prefixes
 * and safely appends optional query parameters with strict separator verification.
 * Guarantees that query parameters (e.g. size=100) are never accidentally concatenated
 * onto endpoint paths without a leading '?' or '&' (e.g. preventing /studentssize=100).
 */
export function normalizeApiUrl(endpoint: string, params?: QueryParams): string {
  const queryString = buildQueryString(params);
  let resolvedUrl = endpoint.trim();

  if (!resolvedUrl.startsWith("http://") && !resolvedUrl.startsWith("https://")) {
    const cleanBase = BASE_URL.replace(/\/+$/, "");
    let cleanEndpoint = resolvedUrl.startsWith("/") ? resolvedUrl : `/${resolvedUrl}`;

    if (cleanBase.endsWith("/api/v1")) {
      if (cleanEndpoint.startsWith("/api/v1/")) {
        cleanEndpoint = cleanEndpoint.replace(/^\/api\/v1/, "");
      } else if (cleanEndpoint.startsWith("/api/")) {
        cleanEndpoint = cleanEndpoint.replace(/^\/api/, "");
      }
    } else if (!cleanBase.endsWith("/api/v1") && !cleanEndpoint.startsWith("/api/v1/")) {
      if (cleanEndpoint.startsWith("/api/")) {
        cleanEndpoint = cleanEndpoint.replace(/^\/api/, "/api/v1");
      } else {
        cleanEndpoint = `/api/v1${cleanEndpoint}`;
      }
    }

    resolvedUrl = `${cleanBase}${cleanEndpoint}`;
  }

  if (!queryString) {
    return resolvedUrl;
  }

  // Ensure queryWithoutLeadingQuestion has no leading '?'
  const queryWithoutLeadingQuestion = queryString.startsWith("?")
    ? queryString.slice(1)
    : queryString;

  if (!queryWithoutLeadingQuestion) {
    return resolvedUrl;
  }

  // Determine correct separator avoiding duplicate '?' or '&'
  let separator = "?";
  if (resolvedUrl.includes("?")) {
    separator = resolvedUrl.endsWith("?") || resolvedUrl.endsWith("&") ? "" : "&";
  }

  return `${resolvedUrl}${separator}${queryWithoutLeadingQuestion}`;
}

/**
 * Internal executor supporting timeouts, serialization, and connection error handling.
 */
async function executeRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    params,
    json,
    body: customBody,
    timeout = 30000,
    token: customToken,
    skipAuth = false,
    headers: customHeaders = {},
    signal: customSignal,
    ...fetchInit
  } = options;

  const token = skipAuth ? null : (customToken ?? getAuthToken());

  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  let body: BodyInit | null | undefined = customBody;

  if (json !== undefined) {
    body = JSON.stringify(json);
  }

  // If body is FormData, delete Content-Type to allow browser to calculate boundary
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    delete baseHeaders["Content-Type"];
  }

  const finalHeaders = applyRequestInterceptors(baseHeaders, token);
  const url = normalizeApiUrl(endpoint, params);

  // Setup timeout controller
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (timeout > 0) {
    timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);
  }

  // Handle external abort signal
  if (customSignal) {
    if (customSignal.aborted) {
      controller.abort();
    } else {
      customSignal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchInit,
      body,
      headers: finalHeaders,
      signal: controller.signal,
    });

    return await handleResponseInterceptors<T>(response, endpoint);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Check if error was caused by request timeout
    if (controller.signal.aborted && (!customSignal || !customSignal.aborted)) {
      throw new ApiError(
        408,
        `Request timeout after ${timeout}ms. Please check your connection and try again.`
      );
    }

    // Network / offline / server down failures
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(
        0,
        "Network error: Unable to connect to the backend API server."
      );
    }

    if (error instanceof Error) {
      throw new ApiError(0, error.message);
    }

    throw new ApiError(0, "An unknown error occurred while communicating with the server.");
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Callable API client interface with ergonomic HTTP verbs attached.
 */
interface ApiClientFunction {
  <T>(endpoint: string, options?: ApiRequestOptions): Promise<T>;
  get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T>;
  post<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T>;
  put<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T>;
  patch<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T>;
  delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T>;
}

/**
 * Centralized API client executing requests with short-lived bearer authorization.
 * Supports both function call `apiClient<T>(...)` and shorthand methods (`apiClient.get`, `apiClient.post`, etc.).
 */
export const apiClient: ApiClientFunction = Object.assign(
  function <T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return executeRequest<T>(endpoint, options);
  },
  {
    get<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
      return executeRequest<T>(endpoint, { ...options, method: "GET" });
    },
    post<T>(endpoint: string, data?: unknown, options: ApiRequestOptions = {}): Promise<T> {
      return executeRequest<T>(endpoint, {
        ...options,
        method: "POST",
        json: data !== undefined ? data : options.json,
      });
    },
    put<T>(endpoint: string, data?: unknown, options: ApiRequestOptions = {}): Promise<T> {
      return executeRequest<T>(endpoint, {
        ...options,
        method: "PUT",
        json: data !== undefined ? data : options.json,
      });
    },
    patch<T>(endpoint: string, data?: unknown, options: ApiRequestOptions = {}): Promise<T> {
      return executeRequest<T>(endpoint, {
        ...options,
        method: "PATCH",
        json: data !== undefined ? data : options.json,
      });
    },
    delete<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
      return executeRequest<T>(endpoint, { ...options, method: "DELETE" });
    },
  }
);
