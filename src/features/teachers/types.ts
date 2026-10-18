export type { Teacher, ApiTeacher } from "@/types";

export interface TeacherFilterParams {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}
