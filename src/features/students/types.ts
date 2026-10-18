export type { Student, ApiStudent } from "@/types";

export interface StudentFilterParams {
  keyword?: string;
  classId?: string;
  status?: string;
  page?: number;
  size?: number;
}
