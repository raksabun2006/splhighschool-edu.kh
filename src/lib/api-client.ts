/**
 * Compatibility re-exports for api-client
 * Re-exports centralized API client and token storage
 */
export {
  apiClient,
  normalizeApiUrl,
  buildQueryString,
  ApiError,
  isApiError,
  registerSessionExpiredHandler,
  unregisterSessionExpiredHandler,
} from "./api/client";

export type {
  PageResponse,
  PaginationParams,
  PageableInfo,
  SortInfo,
  QueryParams,
  ApiRequestOptions,
  ApiErrorPayload,
} from "./api/client";

export {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  hasAuthToken,
} from "./auth/token-storage";

