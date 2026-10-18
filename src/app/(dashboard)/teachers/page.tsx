"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Trash2 } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { teacherService, ApiTeacher } from "@/lib/api-services";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<ApiTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const [formData, setFormData] = useState({
    teacherCode: "",
    fullName: "",
    email: "",
    phone: "",
    sex: "MALE" as "MALE" | "FEMALE" | "OTHER",
    dateOfBirth: "1985-01-01",
    specialization: "Mathematics",
    hireDate: new Date().toISOString().split("T")[0],
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await teacherService.getAll({
        keyword: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setTeachers(res.content || []);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [searchTerm, statusFilter]);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await teacherService.create(formData);
      setDialogOpen(false);
      setFormData({
        teacherCode: "",
        fullName: "",
        email: "",
        phone: "",
        sex: "MALE",
        dateOfBirth: "1985-01-01",
        specialization: "Mathematics",
        hireDate: new Date().toISOString().split("T")[0],
      });
      fetchTeachers();
    } catch (err: any) {
      alert(err?.message || "Failed to create teacher.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបព័ត៌មានគ្រូបង្រៀនរូបនេះចេញពីប្រព័ន្ធមែនទេ?")) return;
    try {
      await teacherService.delete(id);
      fetchTeachers();
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការលុបគ្រូបង្រៀន");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="គ្រូបង្រៀន & សាស្ត្រាចារ្យ"
        description="បញ្ជីរាយនាមលោកគ្រូ អ្នកគ្រូ និងបុគ្គលិកគរុកោសល្យនៃវិទ្យាល័យសំរោងពន្លៃ (Spring Boot API /api/v1/teachers)"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              <span>បន្ថែមគ្រូបង្រៀនថ្មី</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleCreateTeacher}>
              <DialogHeader>
                <DialogTitle>បន្ថែមគ្រូបង្រៀនថ្មី</DialogTitle>
                <DialogDescription>
                  បញ្ចូលព័ត៌មានលម្អិតរបស់លោកគ្រូ-អ្នកគ្រូទៅកាន់ប្រព័ន្ធវិទ្យាល័យសំរោងពន្លៃ។
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">អត្តលេខគ្រូ (Teacher Code)</label>
                    <Input
                      required
                      placeholder="TCH-005"
                      value={formData.teacherCode}
                      onChange={(e) => setFormData({ ...formData, teacherCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">ឈ្មោះគ្រូបង្រៀន</label>
                    <Input
                      required
                      placeholder="ឧ. មាស ស្រីមុំ"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">ឯកទេស / មុខវិជ្ជាបង្រៀន</label>
                  <Input
                    placeholder="គណិតវិទ្យា, រូបវិទ្យា, ភាសាខ្មែរ..."
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">អ៊ីមែល (Email)</label>
                  <Input
                    type="email"
                    required
                    placeholder="teacher@samrongponley.edu.kh"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">លេខទូរស័ព្ទ</label>
                    <Input
                      placeholder="012 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">ភេទ</label>
                    <Select
                      value={formData.sex}
                      onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                    >
                      <option value="MALE">ប្រុស</option>
                      <option value="FEMALE">ស្រី</option>
                      <option value="OTHER">ផ្សេងៗ</option>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  បោះបង់
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "កំពុងរក្សាទុក..." : "រក្សាទុកព័ត៌មាន"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ស្វែងរកតាមឈ្មោះ អត្តលេខ ឬឯកទេសមុខវិជ្ជា..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-56">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">ស្ថានភាពទាំងអស់</option>
            <option value="ACTIVE">កំពុងបង្រៀន (ACTIVE)</option>
            <option value="INACTIVE">ផ្អាកបង្រៀន (INACTIVE)</option>
            <option value="ON_LEAVE">កំពុងសុំច្បាប់ (ON_LEAVE)</option>
            <option value="RESIGNED">បានលាឈប់ (RESIGNED)</option>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={4} cols={6} />
        ) : teachers.length === 0 ? (
          <EmptyState
            title="មិនមានទិន្នន័យគ្រូបង្រៀនទេ"
            description="បច្ចុប្បន្នមិនទាន់មានទិន្នន័យគ្រូបង្រៀនណាមួយដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកឡើយ។"
            actionLabel="បន្ថែមគ្រូបង្រៀនថ្មី"
            onAction={() => setDialogOpen(true)}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">អត្តលេខគ្រូ</TableHead>
                  <TableHead>ឈ្មោះគ្រូបង្រៀន</TableHead>
                  <TableHead>ឯកទេស / មុខវិជ្ជា</TableHead>
                  <TableHead>អ៊ីមែល</TableHead>
                  <TableHead>លេខទូរស័ព្ទ</TableHead>
                  <TableHead>ស្ថានភាព</TableHead>
                  <TableHead className="w-16 text-right">សកម្មភាព</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-mono font-semibold text-primary">
                      {teacher.teacherCode}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {teacher.fullName}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {teacher.specialization || "គ្រូបង្រៀនទូទៅ"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      {teacher.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      {teacher.phone || "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={teacher.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="right">
                          <DropdownMenuItem
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>លុបគ្រូបង្រៀន</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>បង្ហាញ {teachers.length} នៃគ្រូបង្រៀនសរុប {totalElements} នាក់ក្នុងប្រព័ន្ធ</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
