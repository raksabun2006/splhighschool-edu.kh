"use client";

import React, { useState, useEffect } from "react";
import { Plus, UserCheck } from "lucide-react";
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
import { EmptyState } from "@/components/common/empty-state";
import { TableSkeleton } from "@/components/common/loading";
import { studentService, classService, ApiStudent, ApiClass } from "@/lib/api-services";

export default function EnrollmentsPage() {
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      studentService.getAll({ size: 50 }),
      classService.getAll(),
    ]).then(([stRes, clRes]) => {
      if (stRes.status === "fulfilled") setStudents(stRes.value.content || []);
      if (clRes.status === "fulfilled") setClasses(clRes.value.content || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrollments"
        description="Active matriculation and class cohort enrollments live from Spring Boot API"
      />

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : students.length === 0 ? (
          <EmptyState
            title="No Enrolled Students"
            description="Students will appear here once registered into academic classes."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Student Code</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class Section</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((st) => (
                <TableRow key={st.id}>
                  <TableCell className="font-mono font-semibold text-primary">
                    {st.studentCode}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {st.fullName}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted font-semibold">
                      {st.className || "Unassigned"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {st.admissionDate}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {st.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
