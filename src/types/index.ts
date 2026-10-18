import type {
  ApiStudent,
  ApiTeacher,
  ApiParent,
  ApiClass,
  ApiSubject,
  ApiAdmission,
  ApiAcademicYear,
  ApiAttendance,
  ApiGrade,
  ApiSchedule,
  ApiUser,
} from "@/lib/api-services";

export type StatusType =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ENROLLED"
  | "COMPLETED"
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EXCUSED"
  | "SUSPENDED"
  | "GRADUATED"
  | "ON_LEAVE"
  | "UPCOMING";

export type RoleType = "ADMIN" | "PRINCIPAL" | "TEACHER" | "STAFF" | "STUDENT" | "PARENT";

// Re-export real Spring Boot API interfaces
export type {
  ApiStudent,
  ApiTeacher,
  ApiParent,
  ApiClass,
  ApiSubject,
  ApiAdmission,
  ApiAcademicYear,
  ApiAttendance,
  ApiGrade,
  ApiSchedule,
  ApiUser,
};

// Aliases directly referencing live backend models
export type Student = ApiStudent;
export type Teacher = ApiTeacher;
export type Parent = ApiParent;
export type SchoolClass = ApiClass;
export type Subject = ApiSubject;
export type Admission = ApiAdmission;
export type AcademicYear = ApiAcademicYear;
export type AttendanceRecord = ApiAttendance;
export type GradeRecord = ApiGrade;
export type ScheduleItem = ApiSchedule;
export type UserAccount = ApiUser;

export interface Enrollment {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classId: string;
  className: string;
  academicYear: string;
  enrollmentDate: string;
  status: StatusType;
}

export interface DashboardMetric {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  subtitle?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "admission" | "attendance" | "grade" | "system" | "enrollment";
}
