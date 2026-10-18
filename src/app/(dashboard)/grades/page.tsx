"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Award, BookOpen, GraduationCap, School } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { TableSkeleton } from "@/components/common/loading";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  classService,
  subjectService,
  studentService,
  academicYearService,
  gradeService,
  ApiClass,
  ApiSubject,
  ApiStudent,
  ApiAcademicYear,
  ApiGrade,
} from "@/lib/api-services";
import { useAuth } from "@/features/auth";
import { PermissionGuard } from "@/components/auth/permission-guard";

export default function GradesPage() {
  const { user, role, hasPermission } = useAuth();
  const isStudent = role === "STUDENT";
  const canRecordGrade = hasPermission("GRADE_CREATE");

  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [academicYears, setAcademicYears] = useState<ApiAcademicYear[]>([]);

  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [grades, setGrades] = useState<ApiGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    subjectId: "",
    academicYearId: "",
    semester: "SEMESTER_1",
    score: 85,
    remarks: "Term Examination",
  });

  // Fetch initial master data
  useEffect(() => {
    async function loadMasterData() {
      try {
        setLoading(true);
        const [classRes, subjectRes, studentRes, ayRes] = await Promise.allSettled([
          classService.getAll({ size: 100 }),
          subjectService.getAll({ size: 100 }),
          studentService.getAll({ size: 100 }),
          academicYearService.getAll({ size: 20 }),
        ]);

        const cls = classRes.status === "fulfilled" ? classRes.value.content || [] : [];
        const subs = subjectRes.status === "fulfilled" ? subjectRes.value.content || [] : [];
        const sts = studentRes.status === "fulfilled" ? studentRes.value.content || [] : [];
        const ays = ayRes.status === "fulfilled" ? ayRes.value.content || [] : [];

        setClasses(cls);
        setSubjects(subs);
        setStudents(sts);
        setAcademicYears(ays);

        // Determine which student to select
        let targetStudentId = "";
        if (isStudent && user) {
          const matched = sts.find(
            (s) =>
              s.email?.toLowerCase() === user.email?.toLowerCase() ||
              s.fullName?.toLowerCase() === user.fullName?.toLowerCase()
          );
          targetStudentId = user.studentId || matched?.id || (sts.length > 0 ? sts[0].id : "");
        } else if (sts.length > 0) {
          targetStudentId = sts[0].id;
        }

        setSelectedStudentId(targetStudentId);

        // Pre-fill create grade form
        setFormData((prev) => ({
          ...prev,
          studentId: targetStudentId,
          subjectId: subs[0]?.id || "",
          academicYearId: ays[0]?.id || "",
        }));
      } catch (err) {
        console.error("Failed to load grades master data from API:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMasterData();
  }, [isStudent, user]);

  // Fetch grades whenever selected student changes
  const fetchGradesForStudent = useCallback(async (studentId: string) => {
    if (!studentId) {
      setGrades([]);
      return;
    }
    try {
      setGradesLoading(true);
      const res = await gradeService.getStudentGrades(studentId);
      setGrades(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch grades from API:", err);
      setGrades([]);
    } finally {
      setGradesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      fetchGradesForStudent(selectedStudentId);
    }
  }, [selectedStudentId, fetchGradesForStudent]);

  // Filter student list by class selection for admin / faculty
  const filteredStudents =
    selectedClassId === "all"
      ? students
      : students.filter((s) => s.classId === selectedClassId);

  const activeStudent = students.find((s) => s.id === selectedStudentId);

  // Compute live GPA strictly from fetched API grades
  const gpa =
    grades.length > 0
      ? (
          (grades.reduce((acc, g) => acc + (g.score || 0), 0) /
            grades.length /
            100) *
          4
        ).toFixed(2)
      : "N/A";

  const averageScore =
    grades.length > 0
      ? Math.round(
          grades.reduce((acc, g) => acc + (g.score || 0), 0) / grades.length
        )
      : "N/A";

  const handleRecordGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canRecordGrade) {
      alert("អ្នកមិនមានសិទ្ធិបញ្ចូលពិន្ទុ និងនិទ្ទេសសិស្សឡើយ។");
      return;
    }
    try {
      setSubmitting(true);
      await gradeService.record({
        ...formData,
        score: Number(formData.score),
      });
      setDialogOpen(false);
      alert("បានកត់ត្រាពិន្ទុសិស្សទៅកាន់ប្រព័ន្ធជោគជ័យ!");
      if (selectedStudentId === formData.studentId) {
        fetchGradesForStudent(selectedStudentId);
      } else {
        setSelectedStudentId(formData.studentId);
      }
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការកត់ត្រាពិន្ទុ");
    } finally {
      setSubmitting(false);
    }
  };

  const getGradeBadgeColor = (letter: string) => {
    switch (letter) {
      case "A":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
      case "B":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "C":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "D":
        return "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30";
      default:
        return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isStudent ? "លទ្ធផលសិក្សា & ព្រឹត្តិបត្រពិន្ទុផ្ទាល់ខ្លួន" : "លទ្ធផលសិក្សា & ការគ្រប់គ្រងពិន្ទុ"}
        description={
          isStudent
            ? "លទ្ធផលប្រឡង ពិន្ទុ និងមធ្យមភាគនិទ្ទេស (GPA) ផ្ទាល់ខ្លួនរបស់អ្នក (Spring Boot API)"
            : "លទ្ធផលប្រឡង ពិន្ទុតាមមុខវិជ្ជា និងមធ្យមភាគនិទ្ទេស (GPA) នៃវិទ្យាល័យសំរោងពន្លៃ (Spring Boot API /api/v1/grades)"
        }
      >
        <PermissionGuard permission="GRADE_CREATE">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                <span>បញ្ចូលពិន្ទុ & និទ្ទេស</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={handleRecordGrade}>
                <DialogHeader>
                  <DialogTitle>បញ្ចូលពិន្ទុ & និទ្ទេសសិស្ស</DialogTitle>
                  <DialogDescription>
                    កត់ត្រាលទ្ធផលប្រឡង និងការវាយតម្លៃចូលក្នុងប្រព័ន្ធ។
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">សិស្ស</label>
                    <Select
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    >
                      {students.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.fullName} ({st.studentCode})
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">មុខវិជ្ជា</label>
                    <Select
                      value={formData.subjectId}
                      onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">ឆ្នាំសិក្សា</label>
                      <Select
                        value={formData.academicYearId}
                        onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                      >
                        {academicYears.map((ay) => (
                          <option key={ay.id} value={ay.id}>
                            {ay.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">ឆមាស</label>
                      <Select
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      >
                        <option value="SEMESTER_1">ឆមាសទី ១</option>
                        <option value="SEMESTER_2">ឆមាសទី ២</option>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">ពិន្ទុជាក់ស្តែង (០ - ១០០)</label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={formData.score}
                      onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">ការវាយតម្លៃ / កំណត់សម្គាល់ (Remarks)</label>
                    <Input
                      placeholder="ឧ. ការប្រឡងឆមាស / តេស្តប្រចាំខែ"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    បោះបង់
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "កំពុងរក្សាទុក..." : "រក្សាទុកពិន្ទុ"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </PageHeader>

      {/* Control Bar */}
      {!isStudent ? (
        <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <School className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">តម្រងតាមថ្នាក់:</span>
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
                <option value="all">ថ្នាក់ទាំងអស់</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    ថ្នាក់ {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">ជ្រើសរើសសិស្ស:</span>
            </div>
            <div className="w-full sm:w-64">
              <Select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                {filteredStudents.length === 0 ? (
                  <option value="">មិនមានសិស្សក្នុងបញ្ជី</option>
                ) : (
                  filteredStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.studentCode})
                    </option>
                  ))
                )}
              </Select>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {activeStudent?.fullName || user?.fullName || "សិស្សានុសិស្ស"}
              </h3>
              <p className="text-xs text-muted-foreground">
                អត្តលេខ: <span className="font-mono font-medium text-primary">{activeStudent?.studentCode || user?.studentId || "សកម្ម"}</span>
                {activeStudent?.className && ` • ថ្នាក់: ${activeStudent.className}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live GPA & Score Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">មធ្យមភាគនិទ្ទេស (GPA)</span>
            <Award className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {gpa !== "N/A" ? `${gpa} / 4.0` : "N/A"}
          </div>
          <span className="text-[11px] text-muted-foreground">គណនាផ្ទាល់ពីពិន្ទុដែលបានកត់ត្រា</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">ពិន្ទុមធ្យមសរុប</span>
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {averageScore !== "N/A" ? `${averageScore}%` : "N/A"}
          </div>
          <span className="text-[11px] text-muted-foreground">គិតជាមធ្យមគ្រប់មុខវិជ្ជាទាំងអស់</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">ចំនួនមុខវិជ្ជាដែលបានវាយតម្លៃ</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {grades.length} មុខវិជ្ជា
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">ទិន្នន័យផ្ទាល់ពីប្រព័ន្ធ</span>
        </div>
      </div>

      {/* Live Grades Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {loading || gradesLoading ? (
          <TableSkeleton rows={4} cols={6} />
        ) : grades.length === 0 ? (
          <EmptyState
            title="មិនទាន់មានទិន្នន័យពិន្ទុទេ"
            description="បច្ចុប្បន្នមិនទាន់មានកំណត់ត្រាពិន្ទុណាមួយសម្រាប់សិស្សរូបនេះក្នុងប្រព័ន្ធឡើយ។"
            actionLabel={canRecordGrade ? "បញ្ចូលពិន្ទុ & និទ្ទេស" : undefined}
            onAction={canRecordGrade ? () => setDialogOpen(true) : undefined}
          />
        ) : (
          <>
            {/* Mobile Grade Cards */}
            <div className="block md:hidden divide-y divide-border">
              {grades.map((g) => (
                <div key={g.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">
                        {g.subjectName || "មុខវិជ្ជាសិក្សា"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {academicYears.find((ay) => ay.id === g.academicYearId)?.name || "ឆ្នាំបច្ចុប្បន្ន"} • {g.semester === "SEMESTER_2" ? "ឆមាសទី ២" : "ឆមាសទី ១"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`font-bold font-mono px-2.5 py-0.5 border text-xs shrink-0 ${getGradeBadgeColor(
                        g.gradeLetter
                      )}`}
                    >
                      និទ្ទេស {g.gradeLetter || "N/A"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                    <span className="text-muted-foreground">
                      ពិន្ទុ: <strong className="font-mono text-sm text-foreground">{g.score}</strong> / ១០០
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {g.remarks || "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>មុខវិជ្ជា</TableHead>
                    <TableHead>ឆ្នាំសិក្សា</TableHead>
                    <TableHead>ឆមាស</TableHead>
                    <TableHead>ពិន្ទុទទួលបាន</TableHead>
                    <TableHead>និទ្ទេស (Grade)</TableHead>
                    <TableHead>ការវាយតម្លៃ / កំណត់សម្គាល់</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell className="font-semibold text-foreground">
                        <div>{g.subjectName || "មុខវិជ្ជាសិក្សា"}</div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-medium">
                        {academicYears.find((ay) => ay.id === g.academicYearId)?.name || "ឆ្នាំបច្ចុប្បន្ន"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {g.semester === "SEMESTER_2" ? "ឆមាសទី ២" : "ឆមាសទី ១"}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-base text-foreground">
                        {g.score} <span className="text-xs text-muted-foreground font-normal">/ ១០០</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-bold font-mono px-2.5 py-0.5 border ${getGradeBadgeColor(
                            g.gradeLetter
                          )}`}
                        >
                          {g.gradeLetter || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {g.remarks || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
