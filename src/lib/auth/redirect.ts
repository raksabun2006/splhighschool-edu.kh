/**
 * Open-Redirect Prevention Utility
 * Validates redirect paths to ensure users are only redirected to internal application routes.
 */

const ALLOWED_INTERNAL_PREFIXES = [
  "/dashboard",
  "/students",
  "/teachers",
  "/classes",
  "/subjects",
  "/schedules",
  "/attendance",
  "/grades",
  "/admissions",
  "/enrollments",
  "/academic-years",
  "/parents",
  "/users",
  "/settings",
];

export function getSafeRedirectUrl(
  url: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  const trimmed = url.trim();

  // Block dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("//") ||
    lower.startsWith("http://") ||
    lower.startsWith("https://")
  ) {
    return fallback;
  }

  // Must begin with a single slash
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  // Verify that it starts with an allowed prefix or is root
  if (trimmed === "/") {
    return "/dashboard";
  }

  const isAllowed = ALLOWED_INTERNAL_PREFIXES.some(
    (prefix) => trimmed === prefix || trimmed.startsWith(`${prefix}/`) || trimmed.startsWith(`${prefix}?`)
  );

  return isAllowed ? trimmed : fallback;
}
