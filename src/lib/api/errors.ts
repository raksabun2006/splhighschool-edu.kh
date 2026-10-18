export interface ApiErrorPayload {
  status: number;
  message: string;
  timestamp?: string;
  errors?: Record<string, string> | null;
  path?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errors: Record<string, string> | null;
  readonly isSanitized: boolean;
  readonly timestamp?: string;
  readonly path?: string;

  constructor(
    status: number,
    message: string,
    errors: Record<string, string> | null = null,
    payload?: Partial<ApiErrorPayload>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.isSanitized = true;
    this.timestamp = payload?.timestamp;
    this.path = payload?.path;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Status code helpers for clean component-level error branching
   */
  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isTimeout(): boolean {
    return this.status === 408 || this.status === 504;
  }

  get isBadRequest(): boolean {
    return this.status === 400;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isConflict(): boolean {
    return this.status === 409;
  }

  get isValidationError(): boolean {
    return this.status === 422 || (this.status === 400 && this.errors !== null && Object.keys(this.errors).length > 0);
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Retrieves specific field validation error message if available
   */
  getFieldError(fieldName: string): string | undefined {
    return this.errors?.[fieldName];
  }

  /**
   * Returns list of all field validation error messages
   */
  getFieldErrorsList(): string[] {
    if (!this.errors) return [];
    return Object.values(this.errors).filter(Boolean);
  }
}

/**
 * Type guard to check if an unknown caught error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Parses raw backend response body into normalized field errors
 */
export function parseValidationErrors(errorJson: any): Record<string, string> | null {
  if (!errorJson) return null;

  // Spring Boot standard: { errors: { fieldName: "Error message" } }
  if (errorJson.errors && typeof errorJson.errors === "object" && !Array.isArray(errorJson.errors)) {
    return errorJson.errors as Record<string, string>;
  }

  // Spring Boot standard: { errors: [ { field: "email", defaultMessage: "Invalid" } ] }
  if (Array.isArray(errorJson.errors)) {
    const errorMap: Record<string, string> = {};
    for (const item of errorJson.errors) {
      if (item && typeof item === "object") {
        const field = item.field || item.property || "general";
        const message = item.defaultMessage || item.message || "Invalid value";
        errorMap[field] = message;
      }
    }
    return Object.keys(errorMap).length > 0 ? errorMap : null;
  }

  // Spring Boot validation errors alternative: { validationErrors: [...] }
  if (Array.isArray(errorJson.validationErrors)) {
    const errorMap: Record<string, string> = {};
    for (const item of errorJson.validationErrors) {
      if (item && typeof item === "object") {
        const field = item.field || item.property || "general";
        const message = item.message || item.defaultMessage || "Invalid value";
        errorMap[field] = message;
      }
    }
    return Object.keys(errorMap).length > 0 ? errorMap : null;
  }

  return null;
}

/**
 * Sanitizes backend errors to prevent leaking internal database schemas,
 * SQL exceptions, Spring Boot class names, or stack traces to the user.
 */
export function sanitizeApiError(status: number, rawMessage?: string): string {
  // If raw message contains sensitive technical patterns, suppress them
  const sensitivePatterns = [
    /org\.springframework/i,
    /hibernate/i,
    /psql/i,
    /sql/i,
    /syntax error/i,
    /nullpointerexception/i,
    /jwt/i,
    /stack trace/i,
    /foreign key/i,
    /column/i,
    /relation ".*" does not exist/i,
    /duplicate key/i,
  ];

  const containsSensitiveInfo =
    rawMessage && sensitivePatterns.some((pattern) => pattern.test(rawMessage));

  if (containsSensitiveInfo) {
    switch (status) {
      case 0:
        return "Unable to connect to the server. Please check your internet connection.";
      case 400:
        return "The requested information could not be processed. Please check your inputs.";
      case 401:
        return "Your session has expired or is invalid. Please sign in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested record was not found.";
      case 408:
      case 504:
        return "The request timed out. Please try again.";
      case 409:
        return "A record with this information already exists.";
      case 422:
        return "Please verify and correct the submitted fields.";
      default:
        return "An unexpected server error occurred. Please try again later.";
    }
  }

  // If the message is clean and user-readable, preserve it
  if (rawMessage && rawMessage.length < 200 && !rawMessage.includes("\n")) {
    return rawMessage;
  }

  switch (status) {
    case 0:
      return "Unable to reach the server. Please ensure the backend service is running.";
    case 400:
      return "Invalid request. Please verify your data.";
    case 401:
      return "Please sign in to access this feature.";
    case 403:
      return "Access denied: You do not have permission to perform this action.";
    case 404:
      return "Resource not found.";
    case 408:
    case 504:
      return "The connection timed out. Please try again.";
    case 409:
      return "Conflict detected: This record already exists.";
    case 422:
      return "Validation failed on the submitted information.";
    case 500:
    case 502:
    case 503:
      return "The service is temporarily unavailable. Please try again shortly.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

