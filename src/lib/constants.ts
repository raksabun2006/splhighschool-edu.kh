export const APP_CONFIG = {
  name: "វិទ្យាល័យសំរោងពន្លៃ",
  nameEn: "Samrong Ponley High School",
  fullName: "វិទ្យាល័យសំរោងពន្លៃ – Samrong Ponley High School",
  motto: "ការអប់រំប្រកបដោយគុណភាព សម្រាប់អនាគតសិស្សានុសិស្ស",
  description: "ប្រព័ន្ធគ្រប់គ្រងសាលារៀន វិទ្យាល័យសំរោងពន្លៃ — ការអប់រំប្រកបដោយគុណភាពសម្រាប់អនាគតសិស្សានុសិស្ស",
  version: "1.0.0",
  academicYear: "2025-2026",
  schoolName: "វិទ្យាល័យសំរោងពន្លៃ",
  schoolAddress: "ស្រុកសំរោង ខេត្តតាកែវ ប្រទេសកម្ពុជា",
};

export const GRADES = [
  { id: "7", name: "Grade 7" },
  { id: "8", name: "Grade 8" },
  { id: "9", name: "Grade 9" },
  { id: "10", name: "Grade 10" },
  { id: "11", name: "Grade 11" },
  { id: "12", name: "Grade 12" },
] as const;

export const STATUS_TYPES = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ENROLLED: "ENROLLED",
  COMPLETED: "COMPLETED",
} as const;

export const USER_ROLES = {
  ADMIN: "ADMIN",
  PRINCIPAL: "PRINCIPAL",
  TEACHER: "TEACHER",
  STAFF: "STAFF",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
} as const;
