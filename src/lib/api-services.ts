import { apiClient, PageResponse } from "./api-client";

// Types matching Spring Boot OpenAPI Schemas
export interface ApiStudent {
  id: string;
  studentCode: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  address?: string;
  admissionDate: string;
  status: "ACTIVE" | "INACTIVE" | "GRADUATED" | "SUSPENDED" | "TRANSFERRED";
  classId?: string;
  className?: string;
  createdAt?: string;
}

export interface ApiTeacher {
  id: string;
  teacherCode: string;
  fullName: string;
  email: string;
  phone?: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  specialization?: string;
  hireDate: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "RESIGNED";
}

export interface ApiClass {
  id: string;
  name: string;
  gradeLevel: string;
  academicYearId: string;
  academicYearName?: string;
  room?: string;
  capacity: number;
  classTeacherId?: string;
  classTeacherName?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ApiSubject {
  id: string;
  code: string;
  name: string;
  description?: string;
  credit: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface ApiParent {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  occupation?: string;
  address?: string;
  status: "ACTIVE" | "INACTIVE";
  children?: Array<{
    id: string;
    studentCode: string;
    fullName: string;
    className?: string;
  }>;
}

export interface ApiAdmission {
  id: string;
  applicationNumber: string;
  applicantFullName: string;
  applicantEmail: string;
  applicantPhone?: string;
  dateOfBirth: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  address?: string;
  previousSchool?: string;
  applyingForGrade: string;
  academicYearId: string;
  academicYearName?: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "CANCELLED";
  reviewNotes?: string;
  createdAt?: string;
  applicationDate?: string;
}

export interface ApiAcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
}

export interface ApiSchedule {
  id: string;
  classId: string;
  className?: string;
  subjectId: string;
  subjectCode?: string;
  subjectName?: string;
  teacherId: string;
  teacherCode?: string;
  teacherName?: string;
  room?: string;
  dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  startTime: { hour: number; minute: number; second?: number };
  endTime: { hour: number; minute: number; second?: number };
  academicYearId: string;
}

export interface ApiAttendance {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classId: string;
  className?: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remarks?: string;
}

export interface ApiEnrollment {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classId: string;
  className?: string;
  academicYearId: string;
  academicYearName?: string;
  enrollmentDate: string;
  status: "ACTIVE" | "COMPLETED" | "TRANSFERRED" | "CANCELLED";
  remarks?: string;
}

export interface ApiGrade {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  academicYearId: string;
  semester: "SEMESTER_1" | "SEMESTER_2";
  score: number;
  gradeLetter: string;
  remarks?: string;
}

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "PRINCIPAL" | "TEACHER" | "STUDENT" | "PARENT" | "STAFF";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt?: string;
}

// ----------------- Services -----------------

export const studentService = {
  getAll: (params: { keyword?: string; classId?: string; status?: string; page?: number; size?: number } = {}) =>
    apiClient.get<PageResponse<ApiStudent>>("/students", { params }),
  getById: (id: string) => apiClient.get<ApiStudent>(`/students/${id}`),
  create: (data: Partial<ApiStudent>) => apiClient.post<ApiStudent>("/students", data),
  delete: (id: string) => apiClient.delete<void>(`/students/${id}`),
};

export const teacherService = {
  getAll: (params: { keyword?: string; status?: string; page?: number; size?: number } = {}) =>
    apiClient.get<PageResponse<ApiTeacher>>("/teachers", { params }),
  getById: (id: string) => apiClient.get<ApiTeacher>(`/teachers/${id}`),
  create: (data: Partial<ApiTeacher>) => apiClient.post<ApiTeacher>("/teachers", data),
  delete: (id: string) => apiClient.delete<void>(`/teachers/${id}`),
};

export const classService = {
  getAll: (params: { keyword?: string; academicYearId?: string; status?: string; page?: number; size?: number } = {}) =>
    apiClient.get<PageResponse<ApiClass>>("/classes", { params }),
  getById: (id: string) => apiClient.get<ApiClass>(`/classes/${id}`),
  create: (data: Partial<ApiClass>) => apiClient.post<ApiClass>("/classes", data),
};

export const subjectService = {
  getAll: (params: { keyword?: string; status?: string; page?: number; size?: number } = {}) =>
    apiClient.get<PageResponse<ApiSubject>>("/subjects", { params }),
  create: (data: Partial<ApiSubject>) => apiClient.post<ApiSubject>("/subjects", data),
  delete: (id: string) => apiClient.delete<void>(`/subjects/${id}`),
};

export const parentService = {
  getAll: (params: { keyword?: string; status?: string; page?: number; size?: number } = {}) =>
    apiClient.get<PageResponse<ApiParent>>("/parents", { params }),
  create: (data: Partial<ApiParent>) => apiClient.post<ApiParent>("/parents", data),
};

export const admissionService = {
  getAll: (params: { keyword?: string; academicYearId?: string; status?: string; page?: number; size?: number } = {}) =>
    apiClient.get<PageResponse<ApiAdmission>>("/admissions", { params }),
  submit: (data: Partial<ApiAdmission>) => apiClient.post<ApiAdmission>("/admissions", data),
  review: (id: string, data: { status: string; reviewNotes?: string }) =>
    apiClient.patch<ApiAdmission>(`/admissions/${id}/review`, data),
  approve: (id: string, data: { studentCode?: string; classId?: string; admissionDate?: string; reviewNotes?: string }) =>
    apiClient.post<ApiAdmission>(`/admissions/${id}/approve`, data),
};

export const academicYearService = {
  getPublic: async (): Promise<{ content: ApiAcademicYear[] }> => {
    try {
      const res = await fetch("/api/academic-years");
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback below
    }
    return {
      content: [
        {
          id: "5a988873-9f38-46cf-88ee-e1dba7941d45",
          name: "Academic Year 2025-2026",
          status: "ACTIVE",
          startDate: "2025-09-01",
          endDate: "2026-06-30",
        },
      ],
    };
  },
  getAll: async (params: { page?: number; size?: number } = {}): Promise<PageResponse<ApiAcademicYear>> => {
    try {
      return await apiClient.get<PageResponse<ApiAcademicYear>>("/academic-years", { params });
    } catch (err: any) {
      if (err?.status === 403 || err?.status === 401) {
        const pub = await academicYearService.getPublic();
        return {
          content: pub.content,
          totalElements: pub.content.length,
          totalPages: 1,
          size: 20,
          number: 0,
          first: true,
          last: true,
          empty: pub.content.length === 0,
        };
      }
      throw err;
    }
  },
  getCurrent: async (): Promise<ApiAcademicYear> => {
    try {
      return await apiClient.get<ApiAcademicYear>("/academic-years/current");
    } catch (err: any) {
      if (err?.status === 403 || err?.status === 401) {
        const pub = await academicYearService.getPublic();
        return (
          pub.content[0] || {
            id: "5a988873-9f38-46cf-88ee-e1dba7941d45",
            name: "Academic Year 2025-2026",
            status: "ACTIVE",
            startDate: "2025-09-01",
            endDate: "2026-06-30",
          }
        );
      }
      throw err;
    }
  },
  create: (data: { name: string; startDate: string; endDate: string }) =>
    apiClient.post<ApiAcademicYear>("/academic-years", data),
  activate: (id: string) => apiClient.patch<ApiAcademicYear>(`/academic-years/${id}/activate`),
};

export const attendanceService = {
  getByDate: (date: string, page = 0, size = 50) =>
    apiClient.get<PageResponse<ApiAttendance>>("/attendances", { params: { date, page, size } }),
  record: (data: { studentId: string; classId: string; date: string; status: string; remarks?: string }) =>
    apiClient.post<ApiAttendance>("/attendances", data),
  recordBatch: (data: { classId: string; date: string; attendances: Array<{ studentId: string; status: string; remarks?: string }> }) =>
    apiClient.post<ApiAttendance[]>("/attendances/batch", data),
  getByClass: (classId: string, date: string) =>
    apiClient.get<ApiAttendance[]>(`/attendances/class/${classId}`, { params: { date } }),
};

export const gradeService = {
  record: (data: { studentId: string; subjectId: string; academicYearId: string; semester: string; score: number; remarks?: string }) =>
    apiClient.post<ApiGrade>("/grades", data),
  getStudentGrades: (studentId: string, academicYearId?: string, semester?: string) =>
    apiClient.get<ApiGrade[]>(`/grades/student/${studentId}`, { params: { academicYearId, semester } }),
};

export const scheduleService = {
  getAll: () => apiClient.get<ApiSchedule[]>("/schedules"),
  getByClass: (classId: string, academicYearId?: string) =>
    apiClient.get<ApiSchedule[]>(`/schedules/class/${classId}`, { params: { academicYearId } }),
  create: (data: any) => apiClient.post<ApiSchedule>("/schedules", data),
};

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post<{ accessToken: string; tokenType: string; userId: string; email: string; role: string }>(
      "/auth/login",
      { email, password }
    ),
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    sex: "MALE" | "FEMALE" | "OTHER";
    role?: "ADMIN" | "PRINCIPAL" | "TEACHER" | "STUDENT" | "PARENT" | "STAFF";
  }) => apiClient.post<ApiUser>("/auth/register", data),
  getMe: () => apiClient.get<ApiUser>("/auth/me"),
};

