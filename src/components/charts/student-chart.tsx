"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { studentService, ApiStudent } from "@/lib/api-services";
import { Loader2 } from "lucide-react";

export function StudentChart() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    studentService.getAll({ size: 100 })
      .then((res) => {
        setStudents(res.content || []);
        setTotalCount(res.totalElements || (res.content ? res.content.length : 0));
      })
      .catch((err) => console.error("Failed to load student demographics:", err))
      .finally(() => setLoading(false));
  }, []);

  const maleCount = students.filter((s) => s.sex === "MALE").length;
  const femaleCount = students.filter((s) => s.sex === "FEMALE").length;
  const knownTotal = maleCount + femaleCount;
  const malePct = knownTotal > 0 ? Math.round((maleCount / knownTotal) * 100) : 50;
  const femalePct = knownTotal > 0 ? 100 - malePct : 50;

  const activeCount = students.filter((s) => s.status === "ACTIVE").length;
  const activePct = students.length > 0 ? Math.round((activeCount / students.length) * 100) : 100;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>ស្ថិតិប្រជាសាស្ត្រសិស្ស</CardTitle>
        <CardDescription>សមាមាត្រភេទប្រុស-ស្រី និងស្ថានភាពសិស្សសកម្មក្នុងប្រព័ន្ធ</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress split bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-blue-600 dark:text-blue-400">
                  ប្រុស៖ {maleCount} នាក់ ({malePct}%)
                </span>
                <span className="text-pink-600 dark:text-pink-400">
                  ស្រី៖ {femaleCount} នាក់ ({femalePct}%)
                </span>
              </div>
              <div className="h-4 w-full rounded-full bg-muted overflow-hidden flex">
                <div
                  style={{ width: `${malePct}%` }}
                  className="bg-[#1b365d] hover:opacity-90 transition-all"
                  title={`ប្រុស: ${maleCount}`}
                />
                <div
                  style={{ width: `${femalePct}%` }}
                  className="bg-[#10b981] hover:opacity-90 transition-all"
                  title={`ស្រី: ${femaleCount}`}
                />
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-muted/40 border border-border">
                <span className="text-xs text-muted-foreground">សិស្សសរុប</span>
                <p className="text-xl font-bold text-foreground mt-1">{totalCount} នាក់</p>
                <span className="text-[11px] text-emerald-600 font-medium">ទិន្នន័យជាក់ស្តែង</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border">
                <span className="text-xs text-muted-foreground">សិស្សសកម្ម</span>
                <p className="text-xl font-bold text-foreground mt-1">{activeCount} នាក់</p>
                <span className="text-[11px] text-primary font-medium">{activePct}% សកម្ម</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
