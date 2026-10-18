"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { classService, attendanceService } from "@/lib/api-services";
import { Loader2 } from "lucide-react";

interface DayAttendance {
  day: string;
  studentRate: number;
  teacherRate: number;
}

export function AttendanceChart() {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<DayAttendance[]>([]);
  const [studentAvg, setStudentAvg] = useState(98.2);

  useEffect(() => {
    async function loadAttendanceTrends() {
      try {
        setLoading(true);
        const classRes = await classService.getAll({ size: 1 });
        const firstClass = classRes.content && classRes.content.length > 0 ? classRes.content[0] : null;

        const days = ["ចន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ"];
        const today = new Date();
        const currentDayIdx = today.getDay(); // 0 = Sun, 1 = Mon ...
        
        // Compute the dates for the current Monday to Friday
        const weekDates = days.map((day, idx) => {
          const d = new Date(today);
          const diff = (idx + 1) - (currentDayIdx === 0 ? 7 : currentDayIdx);
          d.setDate(today.getDate() + diff);
          return { day, dateStr: d.toISOString().split("T")[0] };
        });

        if (firstClass) {
          const recordsPerDay = await Promise.allSettled(
            weekDates.map((w) => attendanceService.getByClass(firstClass.id, w.dateStr))
          );

          const computed: DayAttendance[] = weekDates.map((w, idx) => {
            const res = recordsPerDay[idx];
            if (res.status === "fulfilled" && Array.isArray(res.value) && res.value.length > 0) {
              const present = res.value.filter((r) => r.status === "PRESENT").length;
              const rate = Math.round((present / res.value.length) * 100);
              return { day: w.day, studentRate: rate, teacherRate: 100 };
            }
            return { day: w.day, studentRate: 0, teacherRate: 0 };
          });

          setAttendanceData(computed);
          const activeDays = computed.filter((c) => c.studentRate > 0);
          const avg = activeDays.length > 0
            ? Math.round(activeDays.reduce((acc, c) => acc + c.studentRate, 0) / activeDays.length)
            : 0;
          setStudentAvg(avg);
        } else {
          setAttendanceData(days.map((day) => ({ day, studentRate: 0, teacherRate: 0 })));
          setStudentAvg(0);
        }
      } catch (err) {
        console.error("Failed to load attendance chart from API:", err);
        setAttendanceData([]);
        setStudentAvg(0);
      } finally {
        setLoading(false);
      }
    }

    loadAttendanceTrends();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>ស្ថិតិវត្តមានប្រចាំសប្តាហ៍</CardTitle>
            <CardDescription>អត្រាវត្តមានសិស្សជាក់ស្តែងពីប្រព័ន្ធ /api/v1/attendances</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-primary" />
              <span className="text-muted-foreground">សិស្សានុសិស្ស ({studentAvg > 0 ? `មធ្យម ${studentAvg}%` : "គ្មានទិន្នន័យ"})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-[#10b981]" />
              <span className="text-muted-foreground">គ្រូបង្រៀន (១០០%)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-56 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {attendanceData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex justify-center items-end gap-1.5 h-44">
                  {/* Student bar */}
                  <div
                    className="w-5 sm:w-8 bg-primary rounded-t-sm transition-all duration-300 relative group-hover:brightness-110 flex items-start justify-center"
                    style={{ height: item.studentRate > 0 ? `${Math.max(item.studentRate, 8)}%` : "4px" }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 text-[10px] bg-popover text-popover-foreground px-1.5 py-0.5 rounded shadow border border-border pointer-events-none whitespace-nowrap">
                      {item.studentRate}%
                    </span>
                  </div>

                  {/* Teacher bar */}
                  <div
                    className="w-5 sm:w-8 bg-emerald-500 rounded-t-sm transition-all duration-300 relative group-hover:brightness-110 flex items-start justify-center"
                    style={{ height: item.teacherRate > 0 ? `${Math.max(item.teacherRate, 8)}%` : "4px" }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 text-[10px] bg-popover text-popover-foreground px-1.5 py-0.5 rounded shadow border border-border pointer-events-none whitespace-nowrap">
                      {item.teacherRate}%
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
