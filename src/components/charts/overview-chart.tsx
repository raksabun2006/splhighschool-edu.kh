"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { classService, studentService, ApiClass, ApiStudent } from "@/lib/api-services";
import { Loader2 } from "lucide-react";

interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

const COLORS = [
  "bg-indigo-500",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-pink-500",
];

export function OverviewChart() {
  const [loading, setLoading] = useState(true);
  const [distribution, setDistribution] = useState<GradeDistribution[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    Promise.allSettled([
      classService.getAll(),
      studentService.getAll({ size: 100 }),
    ]).then(([classRes, studentRes]) => {
      const classes: ApiClass[] = classRes.status === "fulfilled" ? classRes.value.content || [] : [];
      const students: ApiStudent[] = studentRes.status === "fulfilled" ? studentRes.value.content || [] : [];
      const total = studentRes.status === "fulfilled" ? studentRes.value.totalElements : students.length;
      setTotalStudents(total);

      if (classes.length > 0) {
        // Group students by class
        const dist: GradeDistribution[] = classes.map((cls, idx) => {
          const count = students.filter((s) => s.classId === cls.id || s.className === cls.name).length;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          return {
            grade: `ថ្នាក់ ${cls.name}`,
            count,
            percentage,
            color: COLORS[idx % COLORS.length],
          };
        });
        setDistribution(dist);
      } else {
        // Fallback to standard high school grades
        const fallbackGrades = ["ថ្នាក់ទី ៧", "ថ្នាក់ទី ៨", "ថ្នាក់ទី ៩", "ថ្នាក់ទី ១០", "ថ្នាក់ទី ១១", "ថ្នាក់ទី ១២"];
        setDistribution(
          fallbackGrades.map((g, idx) => ({
            grade: g,
            count: 0,
            percentage: 0,
            color: COLORS[idx % COLORS.length],
          }))
        );
      }
      setLoading(false);
    });
  }, []);

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>ការបែងចែកសិស្សតាមថ្នាក់រៀន</CardTitle>
            <CardDescription>ទិន្នន័យចំនួនសិស្សជាក់ស្តែងតាមថ្នាក់នីមួយៗ</CardDescription>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            សរុប៖ {totalStudents} នាក់
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : distribution.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
            មិនទាន់មានថ្នាក់រៀនក្នុងប្រព័ន្ធទេ។
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {distribution.map((item) => (
              <div key={item.grade} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground">{item.grade}</span>
                  <span className="text-muted-foreground font-mono">
                    {item.count} នាក់ ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${Math.max(5, (item.count / maxCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
