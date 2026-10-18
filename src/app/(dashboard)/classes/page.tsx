"use client";

import React, { useState, useEffect } from "react";
import { Plus, School } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { classService, teacherService, academicYearService, ApiClass, ApiTeacher, ApiAcademicYear } from "@/lib/api-services";
import { useAuth } from "@/features/auth";
import { PermissionGuard } from "@/components/auth/permission-guard";

export default function ClassesPage() {
  const { hasPermission } = useAuth();
  const canCreateClass = hasPermission("CLASS_CREATE");
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [teachers, setTeachers] = useState<ApiTeacher[]>([]);
  const [academicYears, setAcademicYears] = useState<ApiAcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gradeLevel: "7",
    capacity: 40,
    room: "Room 101",
    academicYearId: "",
    classTeacherId: "",
  });

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await classService.getAll();
      setClasses(res.content || []);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    if (canCreateClass) {
      teacherService.getAll().then((res) => setTeachers(res.content || [])).catch(console.error);
      academicYearService.getAll().then((res) => {
        setAcademicYears(res.content || []);
        if (res.content && res.content.length > 0) {
          setFormData((prev) => ({ ...prev, academicYearId: res.content[0].id }));
        }
      }).catch(console.error);
    }
  }, [canCreateClass]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateClass) {
      alert("You do not have permission to create a class.");
      return;
    }
    try {
      setSubmitting(true);
      await classService.create({
        ...formData,
        capacity: Number(formData.capacity),
        classTeacherId: formData.classTeacherId || undefined,
      });
      setDialogOpen(false);
      setFormData({
        name: "",
        gradeLevel: "7",
        capacity: 40,
        room: "បន្ទប់ ១០១",
        academicYearId: academicYears[0]?.id || "",
        classTeacherId: "",
      });
      fetchClasses();
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការបង្កើតថ្នាក់រៀនថ្មី");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="បន្ទប់រៀន & បញ្ជីថ្នាក់"
        description="បញ្ជីថ្នាក់រៀន កម្រិតថ្នាក់ និងគ្រូបន្ទុកថ្នាក់នៃវិទ្យាល័យសំរោងពន្លៃ (Spring Boot API /api/v1/classes)"
      >
        <PermissionGuard permission="CLASS_CREATE">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                <span>បង្កើតថ្នាក់រៀនថ្មី</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={handleCreateClass}>
                <DialogHeader>
                  <DialogTitle>បង្កើតថ្នាក់រៀនថ្មី</DialogTitle>
                  <DialogDescription>
                    បន្ថែមថ្នាក់សិក្សាថ្មី និងចាត់តាំងគ្រូបន្ទុកថ្នាក់ក្នុងប្រព័ន្ធ។
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">ឈ្មោះថ្នាក់រៀន</label>
                      <Input
                        required
                        placeholder="ឧ. ៧A, ៨B, ១២A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">កម្រិតថ្នាក់</label>
                      <Select
                        value={formData.gradeLevel}
                        onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                      >
                        <option value="7">ថ្នាក់ទី ៧</option>
                        <option value="8">ថ្នាក់ទី ៨</option>
                        <option value="9">ថ្នាក់ទី ៩</option>
                        <option value="10">ថ្នាក់ទី ១០</option>
                        <option value="11">ថ្នាក់ទី ១១</option>
                        <option value="12">ថ្នាក់ទី ១២</option>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">ចំណុះសិស្សអតិបរមា</label>
                      <Input
                        type="number"
                        required
                        min={1}
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">លេខបន្ទប់សិក្សា</label>
                      <Input
                        required
                        placeholder="បន្ទប់ ១០១"
                        value={formData.room}
                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">គ្រូបន្ទុកថ្នាក់ (Homeroom Teacher)</label>
                    <Select
                      value={formData.classTeacherId}
                      onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
                    >
                      <option value="">-- មិនទាន់ចាត់តាំងគ្រូបន្ទុក --</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.fullName} ({t.specialization || "គ្រូបង្រៀន"})
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    បោះបង់
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "កំពុងបង្កើត..." : "បង្កើតថ្នាក់រៀន"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </PageHeader>

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : classes.length === 0 ? (
          <EmptyState
            title="មិនទាន់មានទិន្នន័យថ្នាក់រៀនទេ"
            description={
              canCreateClass
                ? "បង្កើតថ្នាក់រៀនដំបូងដើម្បីបែងចែកសិស្ស និងចាត់តាំងគ្រូបន្ទុកថ្នាក់។"
                : "បច្ចុប្បន្នមិនទាន់មានទិន្នន័យថ្នាក់រៀននៅក្នុងប្រព័ន្ធឡើយ។"
            }
            actionLabel={canCreateClass ? "បង្កើតថ្នាក់រៀនថ្មី" : undefined}
            onAction={canCreateClass ? () => setDialogOpen(true) : undefined}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">ថ្នាក់រៀន</TableHead>
                <TableHead>កម្រិតថ្នាក់</TableHead>
                <TableHead>បន្ទប់សិក្សា</TableHead>
                <TableHead>គ្រូបន្ទុកថ្នាក់</TableHead>
                <TableHead>ចំណុះសិស្ស</TableHead>
                <TableHead>ស្ថានភាព</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-bold text-foreground text-base">{c.name}</TableCell>
                  <TableCell>ថ្នាក់ទី {c.gradeLevel}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{c.room || "-"}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    {c.classTeacherName || "មិនទាន់ចាត់តាំង"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{c.capacity} នាក់</TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
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
