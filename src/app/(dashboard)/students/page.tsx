"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Download, MoreHorizontal, Eye, Trash2, Loader2, AlertCircle } from "lucide-react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { studentService, classService, ApiStudent, ApiClass } from "@/lib/api-services";

export default function StudentsPage() {
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    studentCode: "",
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "2010-01-01",
    sex: "MALE" as "MALE" | "FEMALE" | "OTHER",
    address: "Phnom Penh",
    admissionDate: new Date().toISOString().split("T")[0],
    classId: "",
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAll({
        keyword: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setStudents(res.content || []);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    classService.getAll().then((res) => {
      setClasses(res.content || []);
      if (res.content && res.content.length > 0) {
        setFormData((prev) => ({ ...prev, classId: res.content[0].id }));
      }
    }).catch(console.error);
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await studentService.create(formData);
      setDialogOpen(false);
      setFormData({
        studentCode: "",
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "2010-01-01",
        sex: "MALE",
        address: "Phnom Penh",
        admissionDate: new Date().toISOString().split("T")[0],
        classId: classes[0]?.id || "",
      });
      fetchStudents();
    } catch (err: any) {
      alert(err?.message || "Failed to create student. Please check input.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await studentService.delete(id);
      fetchStudents();
    } catch (err: any) {
      alert(err?.message || "Failed to delete student.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="បញ្ជីឈ្មោះសិស្សានុសិស្ស"
        description="ការគ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន ប្រវត្តិសិក្សា និងស្ថានភាពសិស្សក្នុងវិទ្យាល័យសំរោងពន្លៃ"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 bg-[#1b365d] hover:bg-[#142845] text-white font-semibold">
              <Plus className="h-4 w-4" />
              <span>ចុះឈ្មោះសិស្សថ្មី</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleCreateStudent}>
              <DialogHeader>
                <DialogTitle>ចុះឈ្មោះសិស្សថ្មី</DialogTitle>
                <DialogDescription>
                  បញ្ចូលព័ត៌មានសិស្សថ្មីទៅក្នុងប្រព័ន្ធរដ្ឋបាលសាលា (Spring Boot REST API)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">អត្តលេខសិស្ស *</label>
                    <Input
                      required
                      placeholder="STU-008"
                      value={formData.studentCode}
                      onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">គោត្តនាម និងនាម *</label>
                    <Input
                      required
                      placeholder="សុខ សុវណ្ណ"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">ភេទ *</label>
                    <Select
                      value={formData.sex}
                      onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                    >
                      <option value="MALE">ប្រុស (Male)</option>
                      <option value="FEMALE">ស្រី (Female)</option>
                      <option value="OTHER">ផ្សេងៗ (Other)</option>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">ថ្នាក់រៀន *</label>
                    <Select
                      value={formData.classId}
                      onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          ថ្នាក់ {c.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">អ៊ីមែល *</label>
                  <Input
                    type="email"
                    required
                    placeholder="student@sph.edu.kh"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">លេខទូរស័ព្ទ</label>
                    <Input
                      placeholder="012 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">ថ្ងៃខែឆ្នាំកំណើត</label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  បោះបង់
                </Button>
                <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {submitting ? "កំពុងរក្សាទុក..." : "រក្សាទុកទិន្នន័យសិស្ស"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filter Bar */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តលេខសិស្ស..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="w-full sm:w-56 shrink-0">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ស្ថានភាពទាំងអស់</option>
            <option value="ACTIVE">កំពុងសិក្សា (ACTIVE)</option>
            <option value="INACTIVE">អសកម្ម (INACTIVE)</option>
            <option value="GRADUATED">បានបញ្ចប់ (GRADUATED)</option>
            <option value="SUSPENDED">ផ្អាកការសិក្សា (SUSPENDED)</option>
            <option value="TRANSFERRED">ផ្លាស់ប្តូរ (TRANSFERRED)</option>
          </Select>
        </div>
      </div>

      {/* Data Section */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : students.length === 0 ? (
          <EmptyState
            title="មិនមានទិន្នន័យសិស្សទេ"
            description="មិនមានកំណត់ត្រាសិស្សក្នុងប្រព័ន្ធទិន្នន័យស្របតាមលក្ខខណ្ឌស្វែងរកនេះទេ។"
            actionLabel="ចុះឈ្មោះសិស្សដំបូង"
            onAction={() => setDialogOpen(true)}
          />
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block md:hidden divide-y divide-border">
              {students.map((student) => (
                <div key={student.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                          {student.studentCode}
                        </span>
                        <StatusBadge status={student.status} />
                      </div>
                      <h3 className="font-semibold text-sm text-foreground break-words pt-1">
                        {student.fullName}
                      </h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="right">
                        <DropdownMenuItem onClick={() => {}}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>មើលប្រវត្តិរូប</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>លុបទិន្នន័យ</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <div>
                      <span className="block text-[11px] text-muted-foreground/70">ថ្នាក់រៀន</span>
                      <span className="font-medium text-foreground">{student.className || "មិនទាន់ចាត់ថ្នាក់"}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-muted-foreground/70">ភេទ</span>
                      <span>{student.sex === "MALE" ? "ប្រុស" : student.sex === "FEMALE" ? "ស្រី" : "ផ្សេងៗ"}</span>
                    </div>
                    <div className="col-span-2 break-all">
                      <span className="block text-[11px] text-muted-foreground/70">ទំនាក់ទំនង</span>
                      <span>{student.email}</span>
                      {student.phone && <span className="block text-foreground">{student.phone}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">លេខសម្គាល់</TableHead>
                    <TableHead>ឈ្មោះពេញ</TableHead>
                    <TableHead>ភេទ</TableHead>
                    <TableHead>ថ្នាក់</TableHead>
                    <TableHead>ទំនាក់ទំនង</TableHead>
                    <TableHead>ស្ថានភាព</TableHead>
                    <TableHead className="w-16 text-right">សកម្មភាព</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono font-semibold text-primary">
                        {student.studentCode}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {student.fullName}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {student.sex === "MALE" ? "ប្រុស" : student.sex === "FEMALE" ? "ស្រី" : "ផ្សេងៗ"}
                      </TableCell>
                      <TableCell className="text-foreground text-xs font-semibold">
                        {student.className || "មិនទាន់ចាត់ថ្នាក់"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        <div>{student.email}</div>
                        <div className="text-[11px]">{student.phone}</div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={student.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="right">
                            <DropdownMenuItem onClick={() => {}}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>មើលប្រវត្តិរូប</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>លុបទិន្នន័យ</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="p-3 sm:p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>Showing {students.length} of {totalElements} students from Spring Boot API</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
