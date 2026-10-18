"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, CheckCircle, XCircle, MoreHorizontal, Sparkles } from "lucide-react";
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
import { admissionService, academicYearService, ApiAdmission, ApiAcademicYear } from "@/lib/api-services";
import { useAuth } from "@/features/auth";

export default function AdmissionsPage() {
  const { user, role, hasPermission } = useAuth();
  const isStudent = role === "STUDENT";
  const canReview = hasPermission("ADMISSION_REVIEW") || hasPermission("ADMISSION_APPROVE");

  const [admissions, setAdmissions] = useState<ApiAdmission[]>([]);
  const [academicYears, setAcademicYears] = useState<ApiAcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    applicantFullName: "",
    applicantEmail: "",
    applicantPhone: "",
    dateOfBirth: "2011-01-01",
    sex: "MALE" as "MALE" | "FEMALE" | "OTHER",
    address: "Phnom Penh",
    previousSchool: "",
    applyingForGrade: "7",
    academicYearId: "",
  });

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const res = await admissionService.getAll({
        keyword: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setAdmissions(res.content || []);
    } catch (err) {
      console.error("Failed to fetch admissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
    academicYearService.getAll().then((res) => {
      setAcademicYears(res.content || []);
      if (res.content && res.content.length > 0) {
        setFormData((prev) => ({ ...prev, academicYearId: res.content[0].id }));
      }
    }).catch(console.error);
  }, [searchTerm, statusFilter]);

  const handleSubmitAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await admissionService.submit(formData);
      setDialogOpen(false);
      setFormData({
        applicantFullName: "",
        applicantEmail: "",
        applicantPhone: "",
        dateOfBirth: "2011-01-01",
        sex: "MALE",
        address: "Phnom Penh",
        previousSchool: "",
        applyingForGrade: "7",
        academicYearId: academicYears[0]?.id || "",
      });
      fetchAdmissions();
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការដាក់ពាក្យស្នើសុំចូលរៀន");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (id: string, status: string) => {
    try {
      await admissionService.review(id, { status, reviewNotes: `Marked as ${status}` });
      fetchAdmissions();
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការពិនិត្យពាក្យស្នើសុំ");
    }
  };

  const displayedAdmissions = isStudent && user?.email
    ? admissions.filter(
        (a) =>
          a.applicantEmail?.toLowerCase() === user.email.toLowerCase() ||
          a.applicantFullName?.toLowerCase() === user.fullName?.toLowerCase()
      )
    : admissions;

  return (
    <div className="space-y-6">
      <PageHeader
        title="ការចុះឈ្មោះ & ស្នើសុំចូលរៀន"
        description="បញ្ជីពាក្យស្នើសុំចូលរៀនរបស់សិស្សថ្មីនៃវិទ្យាល័យសំរោងពន្លៃ (Spring Boot API /api/v1/admissions)"
      >
        <Link href="/apply">
          <Button variant="outline" size="sm" className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
            <Sparkles className="h-4 w-4 text-[#e53935]" />
            <span>ទម្រង់ចុះឈ្មោះសិក្សាអនឡាញ</span>
          </Button>
        </Link>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              <span>ដាក់ពាក្យស្នើសុំថ្មី</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleSubmitAdmission}>
              <DialogHeader>
                <DialogTitle>ដាក់ពាក្យស្នើសុំចូលរៀនថ្មី</DialogTitle>
                <DialogDescription>
                  បញ្ចូលព័ត៌មានលម្អិតរបស់សិស្សថ្មីទៅកាន់ប្រព័ន្ធវិទ្យាល័យសំរោងពន្លៃ។
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">ឈ្មោះពេញរបស់សិស្ស</label>
                  <Input
                    required
                    placeholder="ឧ. សុធា ទេព"
                    value={formData.applicantFullName}
                    onChange={(e) => setFormData({ ...formData, applicantFullName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">ស្នើសុំចូលរៀនថ្នាក់</label>
                    <Select
                      value={formData.applyingForGrade}
                      onChange={(e) => setFormData({ ...formData, applyingForGrade: e.target.value })}
                    >
                      <option value="7">ថ្នាក់ទី ៧</option>
                      <option value="8">ថ្នាក់ទី ៨</option>
                      <option value="9">ថ្នាក់ទី ៩</option>
                      <option value="10">ថ្នាក់ទី ១០</option>
                      <option value="11">ថ្នាក់ទី ១១</option>
                      <option value="12">ថ្នាក់ទី ១២</option>
                    </Select>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">អ៊ីមែលសិស្ស / អាណាព្យាបាល</label>
                    <Input
                      type="email"
                      required
                      placeholder="applicant@gmail.com"
                      value={formData.applicantEmail}
                      onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">លេខទូរស័ព្ទអាណាព្យាបាល</label>
                    <Input
                      placeholder="012 778 899"
                      value={formData.applicantPhone}
                      onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">សាលារៀនពីមុន / បឋមសិក្សា</label>
                  <Input
                    placeholder="សាលាបឋមសិក្សាវត្តកោះ"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>បោះបង់</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "កំពុងដាក់ពាក្យ..." : "ដាក់ពាក្យស្នើសុំ"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ស្វែងរកតាមឈ្មោះសិស្ស លេខកូដពាក្យ ឬអ៊ីមែល..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-56 shrink-0">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">ស្ថានភាពទាំងអស់</option>
            <option value="PENDING">រង់ចាំពិនិត្យ (PENDING)</option>
            <option value="UNDER_REVIEW">កំពុងពិនិត្យ (UNDER_REVIEW)</option>
            <option value="APPROVED">បានអនុម័ត (APPROVED)</option>
            <option value="REJECTED">មិនបានអនុម័ត (REJECTED)</option>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={4} cols={canReview ? 7 : 6} />
        ) : displayedAdmissions.length === 0 ? (
          <EmptyState
            title="មិនមានពាក្យស្នើសុំចូលរៀនទេ"
            description="បច្ចុប្បន្នមិនទាន់មានពាក្យស្នើសុំចូលរៀនណាមួយដែលត្រូវគ្នានឹងការស្វែងរកឡើយ។"
            actionLabel={isStudent ? "ចុះឈ្មោះចូលរៀន" : "ដាក់ពាក្យស្នើសុំដំបូង"}
            onAction={() => {
              if (isStudent) {
                window.location.href = "/apply";
              } else {
                setDialogOpen(true);
              }
            }}
          />
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block md:hidden divide-y divide-border">
              {displayedAdmissions.map((adm) => (
                <div key={adm.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                          {adm.applicationNumber}
                        </span>
                        <StatusBadge status={adm.status} />
                      </div>
                      <h3 className="font-semibold text-sm text-foreground break-words pt-1">
                        {adm.applicantFullName}
                      </h3>
                    </div>
                    {canReview && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="right">
                          <DropdownMenuItem onClick={() => handleReview(adm.id, "APPROVED")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                            <span>អនុម័តទទួលចូលរៀន</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReview(adm.id, "REJECTED")} className="text-destructive focus:text-destructive">
                            <XCircle className="mr-2 h-4 w-4" />
                            <span>បដិសេធពាក្យ</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <div>
                      <span className="block text-[11px] text-muted-foreground/70">ថ្នាក់ស្នើសុំ</span>
                      <span className="font-medium text-foreground">ថ្នាក់ទី {adm.applyingForGrade}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-muted-foreground/70">សាលារៀនពីមុន</span>
                      <span className="text-foreground">{adm.previousSchool || "-"}</span>
                    </div>
                    <div className="col-span-2 break-all">
                      <span className="block text-[11px] text-muted-foreground/70">ទំនាក់ទំនង</span>
                      <span>{adm.applicantEmail}</span>
                      {adm.applicantPhone && <span className="block text-foreground">{adm.applicantPhone}</span>}
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
                    <TableHead className="w-36">លេខកូដពាក្យ</TableHead>
                    <TableHead>ឈ្មោះបេក្ខជនសិស្ស</TableHead>
                    <TableHead>ថ្នាក់ស្នើសុំ</TableHead>
                    <TableHead>អ៊ីមែលទំនាក់ទំនង</TableHead>
                    <TableHead>សាលារៀនពីមុន</TableHead>
                    <TableHead>ស្ថានភាព</TableHead>
                    {canReview && <TableHead className="w-16 text-right">សកម្មភាព</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedAdmissions.map((adm) => (
                    <TableRow key={adm.id}>
                      <TableCell className="font-mono font-semibold text-primary">
                        {adm.applicationNumber}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {adm.applicantFullName}
                      </TableCell>
                      <TableCell>ថ្នាក់ទី {adm.applyingForGrade}</TableCell>
                      <TableCell className="text-muted-foreground text-xs font-mono">
                        {adm.applicantEmail}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {adm.previousSchool || "-"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={adm.status} />
                      </TableCell>
                      {canReview && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="right">
                              <DropdownMenuItem onClick={() => handleReview(adm.id, "APPROVED")}>
                                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                                <span>អនុម័តទទួលចូលរៀន</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReview(adm.id, "REJECTED")} className="text-destructive focus:text-destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>បដិសេធពាក្យ</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
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
