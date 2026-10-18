"use client";

import React, { useState, useEffect } from "react";
import { Plus, Clock, MapPin, User } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/common/loading";
import { EmptyState } from "@/components/common/empty-state";
import { classService, scheduleService, ApiClass, ApiSchedule } from "@/lib/api-services";

function formatScheduleTime(time: any): string {
  if (!time) return "--:--";
  if (typeof time === "string") return time.slice(0, 5);
  if (typeof time === "object" && time.hour !== undefined) {
    const h = String(time.hour).padStart(2, "0");
    const m = String(time.minute || 0).padStart(2, "0");
    return `${h}:${m}`;
  }
  return String(time);
}

const DAY_MAP: Record<string, string> = {
  MONDAY: "ថ្ងៃចន្ទ",
  TUESDAY: "ថ្ងៃអង្គារ",
  WEDNESDAY: "ថ្ងៃពុធ",
  THURSDAY: "ថ្ងៃព្រហស្បតិ៍",
  FRIDAY: "ថ្ងៃសុក្រ",
  SATURDAY: "ថ្ងៃសៅរ៍",
  SUNDAY: "ថ្ងៃអាទិត្យ",
};

export default function SchedulesPage() {
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [schedules, setSchedules] = useState<ApiSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    classService.getAll().then((res) => {
      const cls = res.content || [];
      setClasses(cls);
      if (cls.length > 0) {
        setSelectedClassId(cls[0].id);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    setLoading(true);
    scheduleService.getByClass(selectedClassId)
      .then((data) => setSchedules(data || []))
      .catch((err) => {
        console.error("Failed to load schedules:", err);
        setSchedules([]);
      })
      .finally(() => setLoading(false));
  }, [selectedClassId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="កាលវិភាគសិក្សា & បន្ទប់រៀន"
        description="កាលវិភាគបង្រៀន និងរៀនប្រចាំសប្តាហ៍តាមថ្នាក់នៃវិទ្យាល័យសំរោងពន្លៃ (Spring Boot API /api/v1/schedules)"
      />

      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-xs">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">ជ្រើសរើសថ្នាក់រៀន:</span>
        <div className="w-48">
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
        {loading ? (
          <TableSkeleton rows={3} cols={3} />
        ) : schedules.length === 0 ? (
          <EmptyState
            title="មិនទាន់មានកាលវិភាគសម្រាប់ថ្នាក់នេះទេ"
            description="បច្ចុប្បន្នមិនទាន់មានការរៀបចំម៉ោងបង្រៀន និងមុខវិជ្ជាសម្រាប់ថ្នាក់រៀននេះក្នុងប្រព័ន្ធឡើយ។"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((item) => (
              <Card key={item.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {formatScheduleTime(item.startTime)} - {formatScheduleTime(item.endTime)}
                    </span>
                    <span className="text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded">
                      {DAY_MAP[item.dayOfWeek] || item.dayOfWeek}
                    </span>
                  </div>
                  <CardTitle className="text-base pt-2 text-foreground font-bold">
                    {item.subjectName || item.subjectCode}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{item.teacherName || "លោកគ្រូ / អ្នកគ្រូទទួលបន្ទុក"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{item.room || "អគារសិក្សាធំ"}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
