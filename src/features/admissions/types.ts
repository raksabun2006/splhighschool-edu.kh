export type { Admission, ApiAdmission } from "@/types";

export interface AdmissionFilterParams {
  status?: string;
  page?: number;
  size?: number;
}
