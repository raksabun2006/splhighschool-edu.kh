import { UserRole, AuthUser } from "@/types/auth";
import { hasPermission as checkPermission, AppPermission } from "./permissions";

export interface RoleConfig {
  role: UserRole;
  label: string;
  badgeLabel: string;
  description: string;
  badgeColor: string;
  badgeBg: string;
  defaultPath: string;
}

export const ROLES: Record<UserRole, RoleConfig> = {
  ADMIN: {
    role: "ADMIN",
    label: "អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin)",
    badgeLabel: "អ្នកគ្រប់គ្រង",
    description: "ការគ្រប់គ្រងប្រព័ន្ធទូទាំងសាលា ការកំណត់ និងគណនីអ្នកប្រើប្រាស់។",
    badgeColor: "text-white",
    badgeBg: "bg-[#1b365d]",
    defaultPath: "/dashboard",
  },
  PRINCIPAL: {
    role: "PRINCIPAL",
    label: "នាយកសាលា (Principal)",
    badgeLabel: "នាយកសាលា",
    description: "ការត្រួតពិនិត្យទូទៅ ការវាយតម្លៃលទ្ធផលសិក្សា និងរបាយការណ៍ស្ថាប័ន។",
    badgeColor: "text-white",
    badgeBg: "bg-[#162a4a]",
    defaultPath: "/dashboard",
  },
  TEACHER: {
    role: "TEACHER",
    label: "លោកគ្រូ / អ្នកគ្រូ (Faculty)",
    badgeLabel: "គ្រូបង្រៀន",
    description: "ការគ្រប់គ្រងការបង្រៀន ការកត់ត្រាវត្តមានសិស្ស និងការបញ្ចូលពិន្ទុ។",
    badgeColor: "text-white",
    badgeBg: "bg-[#10b981]",
    defaultPath: "/dashboard",
  },
  STUDENT: {
    role: "STUDENT",
    label: "សិស្សានុសិស្ស (Student)",
    badgeLabel: "សិស្ស",
    description: "កាលវិភាគសិក្សា លទ្ធផលពិន្ទុ បញ្ជីវត្តមាន និងព័ត៌មានមុខវិជ្ជា។",
    badgeColor: "text-blue-700 dark:text-blue-300",
    badgeBg: "bg-blue-500/15 border-blue-500/30",
    defaultPath: "/dashboard",
  },
  PARENT: {
    role: "PARENT",
    label: "មាតាបិតា / អាណាព្យាបាល (Parent)",
    badgeLabel: "អាណាព្យាបាល",
    description: "តាមដានវត្តមានសិក្សា លទ្ធផលប្រឡង និងទំនាក់ទំនងជាមួយលោកគ្រូអ្នកគ្រូ។",
    badgeColor: "text-purple-700 dark:text-purple-300",
    badgeBg: "bg-purple-500/15 border-purple-500/30",
    defaultPath: "/dashboard",
  },
  STAFF: {
    role: "STAFF",
    label: "បុគ្គលិកការិយាល័យ (Staff)",
    badgeLabel: "ការិយាល័យ",
    description: "ការទទួលពាក្យសុំចូលរៀន ចុះឈ្មោះសិស្ស និងការរៀបចំថ្នាក់រៀន។",
    badgeColor: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    defaultPath: "/dashboard",
  },
};

// -------------------------------------------------------------
// Route-Level Permissions (Frontend UX Access Routing)
// -------------------------------------------------------------
export const ROUTE_PERMISSIONS: Record<string, readonly UserRole[]> = {
  "/dashboard": ["ADMIN", "PRINCIPAL", "TEACHER", "STUDENT", "PARENT", "STAFF"],
  "/academic-years": ["ADMIN", "PRINCIPAL", "STAFF"],
  "/classes": ["ADMIN", "PRINCIPAL", "TEACHER", "STAFF", "STUDENT"],
  "/subjects": ["ADMIN", "PRINCIPAL", "TEACHER", "STUDENT"],
  "/schedules": ["ADMIN", "PRINCIPAL", "TEACHER", "STUDENT", "PARENT"],
  "/students": ["ADMIN", "PRINCIPAL", "TEACHER", "STAFF", "PARENT"],
  "/admissions": ["ADMIN", "PRINCIPAL", "STAFF", "STUDENT"],
  "/enrollments": ["ADMIN", "PRINCIPAL", "STAFF"],
  "/teachers": ["ADMIN", "PRINCIPAL", "PARENT", "STAFF"],
  "/attendance": ["ADMIN", "PRINCIPAL", "TEACHER", "STUDENT", "PARENT", "STAFF"],
  "/grades": ["ADMIN", "PRINCIPAL", "TEACHER", "STUDENT", "PARENT"],
  "/parents": ["ADMIN", "PRINCIPAL", "TEACHER", "STAFF"],
  "/users": ["ADMIN"], // System user accounts management strictly Admin
  "/settings": ["ADMIN", "STUDENT"], // General settings or profile
};

// Legacy action permissions mapping to AppPermission
export type PermissionAction =
  | "create:student"
  | "edit:student"
  | "delete:student"
  | "create:teacher"
  | "delete:teacher"
  | "create:class"
  | "delete:class"
  | "create:subject"
  | "delete:subject"
  | "record:attendance"
  | "record:grades"
  | "manage:admissions"
  | "manage:users"
  | "manage:settings";

const ACTION_TO_APP_PERMISSION: Record<PermissionAction, AppPermission> = {
  "create:student": "STUDENT_CREATE",
  "edit:student": "STUDENT_UPDATE",
  "delete:student": "STUDENT_DELETE",
  "create:teacher": "USER_CREATE",
  "delete:teacher": "USER_DELETE",
  "create:class": "CLASS_CREATE",
  "delete:class": "CLASS_DELETE",
  "create:subject": "SUBJECT_MANAGE",
  "delete:subject": "SUBJECT_MANAGE",
  "record:attendance": "ATTENDANCE_CREATE",
  "record:grades": "GRADE_CREATE",
  "manage:admissions": "ADMISSION_REVIEW",
  "manage:users": "USER_VIEW",
  "manage:settings": "SYSTEM_SETTINGS",
};

export function hasPermission(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export function canAccessRoute(role: UserRole | string | undefined, pathname: string): boolean {
  if (!role) return false;
  const normalized = (role.toUpperCase() || "ADMIN") as UserRole;
  const baseRoute = "/" + pathname.split("/").filter(Boolean)[0];
  const allowed = ROUTE_PERMISSIONS[baseRoute];
  if (!allowed) return true; // If not explicitly restricted, allow
  return allowed.includes(normalized);
}

export function canPerformAction(role: UserRole | string | undefined, action: PermissionAction): boolean {
  if (!role) return false;
  const appPerm = ACTION_TO_APP_PERMISSION[action];
  if (!appPerm) return false;
  return checkPermission(role as UserRole, appPerm);
}

export function getRoleConfig(role?: string): RoleConfig {
  const normalized = (role?.toUpperCase() || "ADMIN") as UserRole;
  return ROLES[normalized] || ROLES.ADMIN;
}

// Development preview user templates for UX simulation
export const MOCK_USERS_BY_ROLE: Record<UserRole, AuthUser> = {
  ADMIN: {
    id: "admin-01",
    fullName: "Bun Raksa",
    email: "raksabun2006@gmail.com",
    role: "ADMIN",
    status: "ACTIVE",
  },
  PRINCIPAL: {
    id: "principal-01",
    fullName: "Dr. Chan Sarun",
    email: "principal@educore.edu.kh",
    role: "PRINCIPAL",
    status: "ACTIVE",
  },
  TEACHER: {
    id: "teacher-01",
    fullName: "Prof. Ing Davann",
    email: "ing.davann@school.edu.kh",
    role: "TEACHER",
    status: "ACTIVE",
    teacherId: "TC-2025-01",
    className: "Grade 10A, 11B",
  },
  STUDENT: {
    id: "student-01",
    fullName: "Sokha Thearith",
    email: "sokha.thearith@student.edu.kh",
    role: "STUDENT",
    status: "ACTIVE",
    studentId: "KH-2025-0042",
    className: "Grade 11A",
    gradeLevel: "11",
  },
  PARENT: {
    id: "parent-01",
    fullName: "Chhim Vanna",
    email: "chhim.vanna@parent.edu.kh",
    role: "PARENT",
    status: "ACTIVE",
    parentId: "PR-2025-09",
  },
  STAFF: {
    id: "staff-01",
    fullName: "Keo Samnang",
    email: "keo.samnang@staff.edu.kh",
    role: "STAFF",
    status: "ACTIVE",
  },
};
