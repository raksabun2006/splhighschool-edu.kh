import { UserRole, AppPermission } from "@/types/auth";
export type { AppPermission };

/**
 * Complete role-to-permission mapping.
 * Note: Frontend permissions are strictly for UX rendering (hiding/disabling actions).
 * The Spring Boot backend remains the final authority enforcing method and endpoint authorization.
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly AppPermission[]> = {
  // ADMIN: full platform administrative privileges
  ADMIN: [
    "STUDENT_VIEW",
    "STUDENT_CREATE",
    "STUDENT_UPDATE",
    "STUDENT_DELETE",
    "ADMISSION_VIEW",
    "ADMISSION_CREATE",
    "ADMISSION_REVIEW",
    "ADMISSION_APPROVE",
    "ADMISSION_REJECT",
    "CLASS_VIEW",
    "CLASS_CREATE",
    "CLASS_UPDATE",
    "CLASS_DELETE",
    "ATTENDANCE_VIEW",
    "ATTENDANCE_CREATE",
    "ATTENDANCE_UPDATE",
    "GRADE_VIEW",
    "GRADE_CREATE",
    "GRADE_UPDATE",
    "USER_VIEW",
    "USER_CREATE",
    "USER_UPDATE",
    "USER_DELETE",
    "SYSTEM_SETTINGS",
    "ACADEMIC_YEAR_MANAGE",
    "SCHEDULE_MANAGE",
    "SUBJECT_MANAGE",
  ] as const,

  // PRINCIPAL: Executive oversight, student/class/academic management, admissions
  PRINCIPAL: [
    "STUDENT_VIEW",
    "STUDENT_CREATE",
    "STUDENT_UPDATE",
    "ADMISSION_VIEW",
    "ADMISSION_CREATE",
    "ADMISSION_REVIEW",
    "ADMISSION_APPROVE",
    "ADMISSION_REJECT",
    "CLASS_VIEW",
    "CLASS_CREATE",
    "CLASS_UPDATE",
    "ATTENDANCE_VIEW",
    "GRADE_VIEW",
    "ACADEMIC_YEAR_MANAGE",
    "SCHEDULE_MANAGE",
    "SUBJECT_MANAGE",
  ] as const,

  // TEACHER: Assigned classes, attendance logging, grade submission
  TEACHER: [
    "STUDENT_VIEW",
    "CLASS_VIEW",
    "ATTENDANCE_VIEW",
    "ATTENDANCE_CREATE",
    "ATTENDANCE_UPDATE",
    "GRADE_VIEW",
    "GRADE_CREATE",
    "GRADE_UPDATE",
  ] as const,

  // STUDENT: View own academic records, grades, attendance, schedule
  STUDENT: [
    "CLASS_VIEW",
    "ATTENDANCE_VIEW",
    "GRADE_VIEW",
  ] as const,

  // PARENT: View child academic records, grades, attendance
  PARENT: [
    "STUDENT_VIEW",
    "CLASS_VIEW",
    "ATTENDANCE_VIEW",
    "GRADE_VIEW",
  ] as const,

  // STAFF: Admissions intake, student record creation, enrollments, classroom rosters
  STAFF: [
    "STUDENT_VIEW",
    "STUDENT_CREATE",
    "STUDENT_UPDATE",
    "ADMISSION_VIEW",
    "ADMISSION_CREATE",
    "ADMISSION_REVIEW",
    "ADMISSION_APPROVE",
    "ADMISSION_REJECT",
    "CLASS_VIEW",
    "CLASS_CREATE",
    "CLASS_UPDATE",
    "ATTENDANCE_VIEW",
    "ATTENDANCE_CREATE",
  ] as const,
};

/**
 * Checks whether a given role has a specific permission.
 */
export function hasPermission(
  role: UserRole | string | undefined | null,
  permission: AppPermission
): boolean {
  if (!role) return false;
  const normalized = role.toUpperCase() as UserRole;
  const permissions = ROLE_PERMISSIONS[normalized];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Checks whether a role has AT LEAST ONE of the specified permissions.
 */
export function hasAnyPermission(
  role: UserRole | string | undefined | null,
  permissions: AppPermission[]
): boolean {
  if (!role || permissions.length === 0) return false;
  return permissions.some((perm) => hasPermission(role, perm));
}

/**
 * Checks whether a role has ALL of the specified permissions.
 */
export function hasAllPermissions(
  role: UserRole | string | undefined | null,
  permissions: AppPermission[]
): boolean {
  if (!role || permissions.length === 0) return false;
  return permissions.every((perm) => hasPermission(role, perm));
}
