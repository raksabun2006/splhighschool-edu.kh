export type UserRole =
  | "ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "STUDENT"
  | "PARENT"
  | "STAFF";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  sex?: "MALE" | "FEMALE" | "OTHER";
  avatar?: string;
  phone?: string;
  studentId?: string;
  teacherId?: string;
  parentId?: string;
  className?: string;
  gradeLevel?: string;
  createdAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AppPermission =
  // Student permissions
  | "STUDENT_VIEW"
  | "STUDENT_CREATE"
  | "STUDENT_UPDATE"
  | "STUDENT_DELETE"
  // Admission permissions
  | "ADMISSION_VIEW"
  | "ADMISSION_CREATE"
  | "ADMISSION_REVIEW"
  | "ADMISSION_APPROVE"
  | "ADMISSION_REJECT"
  // Class permissions
  | "CLASS_VIEW"
  | "CLASS_CREATE"
  | "CLASS_UPDATE"
  | "CLASS_DELETE"
  // Attendance permissions
  | "ATTENDANCE_VIEW"
  | "ATTENDANCE_CREATE"
  | "ATTENDANCE_UPDATE"
  // Grade permissions
  | "GRADE_VIEW"
  | "GRADE_CREATE"
  | "GRADE_UPDATE"
  // User governance permissions
  | "USER_VIEW"
  | "USER_CREATE"
  | "USER_UPDATE"
  | "USER_DELETE"
  // Settings & academic configuration
  | "SYSTEM_SETTINGS"
  | "ACADEMIC_YEAR_MANAGE"
  | "SCHEDULE_MANAGE"
  | "SUBJECT_MANAGE";
