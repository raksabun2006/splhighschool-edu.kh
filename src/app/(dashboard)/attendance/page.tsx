"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Save, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { TableSkeleton } from "@/components/common/loading";
import { classService, studentService, attendanceService, ApiClass, ApiStudent, ApiAttendance } from "@/lib/api-services";

export default function AttendancePage() {
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED">>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    classService.getAll().then((res) => {
      setClasses(res.content || []);
      if (res.content && res.content.length > 0) {
        setSelectedClassId(res.content[0].id);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;

    async function loadRosterAndAttendance() {
      try {
        setLoading(true);
        const [studentRes, attendanceRes] = await Promise.allSettled([
          studentService.getAll({ classId: selectedClassId }),
          attendanceService.getByClass(selectedClassId, selectedDate),
        ]);

        const roster = studentRes.status === "fulfilled" ? studentRes.value.content || [] : [];
        setStudents(roster);

        const initialMap: Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"> = {};
        roster.forEach((s) => {
          initialMap[s.id] = "PRESENT";
        });

        if (attendanceRes.status === "fulfilled" && Array.isArray(attendanceRes.value)) {
          attendanceRes.value.forEach((rec) => {
            initialMap[rec.studentId] = rec.status;
          });
        }
        setAttendanceMap(initialMap);
      } catch (err) {
        console.error("Failed to load attendance roster:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRosterAndAttendance();
  }, [selectedClassId, selectedDate]);

  const updateStatus = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassId || students.length === 0) return;
    try {
      setSaving(true);
      const batchData = {
        classId: selectedClassId,
        date: selectedDate,
        attendances: students.map((s) => ({
          studentId: s.id,
          status: attendanceMap[s.id] || "PRESENT",
          remarks: "Recorded via web portal",
        })),
      };
      await attendanceService.recordBatch(batchData);
      alert("បានរក្សាទុកទិន្នន័យវត្តមានទៅកាន់ប្រព័ន្ធជោគជ័យ!");
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការរក្សាទុកវត្តមាន");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendanceMap).filter((s) => s === "PRESENT").length;
  const rate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="បញ្ជីវត្តមានសិស្ស"
        description="កត់ត្រាវត្តមានសិស្សប្រចាំថ្ងៃតាមថ្នាក់ និងកាលបរិច្ឆេទ (Spring Boot API /api/v1/attendances)"
      >
        <Button
          onClick={handleSaveAttendance}
          disabled={saving || students.length === 0}
          size="sm"
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "កំពុងរក្សាទុក..." : "រក្សាទុកវត្តមាន"}</span>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-wrap items-center justify-between col-span-2 gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs font-semibold"
              />
            </div>
            <div className="w-44">
              <Select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    ថ្នាក់ {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">បញ្ជីរាយនាមសិស្ស:</span>
            <p className="font-bold text-foreground text-sm">{students.length} នាក់</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">អត្រាវត្តមានសរុប</span>
            <p className="text-2xl font-bold text-foreground mt-0.5">{rate}%</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
            វត្តមាន {presentCount} / {students.length} នាក់
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : students.length === 0 ? (
          <EmptyState
            title="មិនទាន់មានសិស្សក្នុងថ្នាក់នេះទេ"
            description="សូមចាត់តាំងសិស្សចូលក្នុងថ្នាក់នេះជាមុនសិន ដើម្បីកត់ត្រាវត្តមានប្រចាំថ្ងៃ។"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">អត្តលេខសិស្ស</TableHead>
                <TableHead>ឈ្មោះសិស្ស</TableHead>
                <TableHead>ស្ថានភាពវត្តមាន</TableHead>
                <TableHead className="w-64 text-right">កែសម្រួលវត្តមានរហ័ស</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const currentStatus = attendanceMap[student.id] || "PRESENT";
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono font-semibold text-primary">
                      {student.studentCode}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {student.fullName}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={currentStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex rounded-md shadow-xs" role="group">
                        <button
                          type="button"
                          onClick={() => updateStatus(student.id, "PRESENT")}
                          className={`px-2.5 py-1 text-xs font-medium rounded-l-md border border-border transition-colors ${
                            currentStatus === "PRESENT"
                              ? "bg-emerald-600 text-white font-bold"
                              : "bg-background text-muted-foreground hover:bg-muted"
                          }`}
                          title="មានវត្តមាន (Present)"
                        >
                          វត្តមាន
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(student.id, "LATE")}
                          className={`px-2.5 py-1 text-xs font-medium border-t border-b border-border transition-colors ${
                            currentStatus === "LATE"
                              ? "bg-amber-600 text-white font-bold"
                              : "bg-background text-muted-foreground hover:bg-muted"
                          }`}
                          title="មកយឺត (Late)"
                        >
                          មកយឺត
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(student.id, "EXCUSED")}
                          className={`px-2.5 py-1 text-xs font-medium border-t border-b border-border transition-colors ${
                            currentStatus === "EXCUSED"
                              ? "bg-blue-600 text-white font-bold"
                              : "bg-background text-muted-foreground hover:bg-muted"
                          }`}
                          title="មានច្បាប់ (Excused)"
                        >
                          ច្បាប់
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(student.id, "ABSENT")}
                          className={`px-2.5 py-1 text-xs font-medium rounded-r-md border border-border transition-colors ${
                            currentStatus === "ABSENT"
                              ? "bg-red-600 text-white font-bold"
                              : "bg-background text-muted-foreground hover:bg-muted"
                          }`}
                          title="អវត្តមានឥតច្បាប់ (Absent)"
                        >
                          អវត្តមាន
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
