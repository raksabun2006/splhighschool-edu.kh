export type { Enrollment, ApiStudent, ApiClass } from "@/types";

export interface EnrollmentFilterParams {
  classId?: string;
  keyword?: string;
  status?: string;
}
