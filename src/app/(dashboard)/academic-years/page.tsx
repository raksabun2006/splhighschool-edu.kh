"use client";

import React, { useState, useEffect } from "react";
import { Plus, CalendarDays, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { academicYearService, ApiAcademicYear } from "@/lib/api-services";

export default function AcademicYearsPage() {
  const [years, setYears] = useState<ApiAcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "2026-09-01",
    endDate: "2027-06-30",
  });

  const fetchYears = async () => {
    try {
      setLoading(true);
      const res = await academicYearService.getAll();
      setYears(res.content || []);
    } catch (err) {
      console.error("Failed to fetch academic years:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await academicYearService.create(formData);
      setDialogOpen(false);
      setFormData({ name: "", startDate: "2026-09-01", endDate: "2027-06-30" });
      fetchYears();
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការបង្កើតឆ្នាំសិក្សា");
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await academicYearService.activate(id);
      fetchYears();
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការកំណត់ឆ្នាំសិក្សាជាសកម្ម");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ឆ្នាំសិក្សា & ប្រតិទិនអប់រំ"
        description="គ្រប់គ្រងវដ្តឆ្នាំសិក្សា និងកាលបរិច្ឆេទបើកបវេសនកាល (Spring Boot API /api/v1/academic-years)"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              <span>បន្ថែមឆ្នាំសិក្សាថ្មី</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleCreateYear}>
              <DialogHeader>
                <DialogTitle>បង្កើតឆ្នាំសិក្សាថ្មី</DialogTitle>
                <DialogDescription>
                  កំណត់ឆ្នាំសិក្សា និងកាលបរិច្ឆេទចាប់ផ្តើម-បញ្ចប់ក្នុងប្រព័ន្ធ។
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">ឈ្មោះឆ្នាំសិក្សា</label>
                  <Input
                    required
                    placeholder="ឧ. ឆ្នាំសិក្សា ២០២៦ - ២០២៧"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">កាលបរិច្ឆេទចាប់ផ្តើម</label>
                    <Input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">កាលបរិច្ឆេទបញ្ចប់</label>
                    <Input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>បោះបង់</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "កំពុងបង្កើត..." : "រក្សាទុកឆ្នាំសិក្សា"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={2} cols={5} />
        ) : years.length === 0 ? (
          <EmptyState
            title="មិនមានទិន្នន័យឆ្នាំសិក្សាទេ"
            description="បង្កើតឆ្នាំសិក្សាដំបូងដើម្បីដំណើរការប្រព័ន្ធបង្រៀន និងរៀន។"
            actionLabel="បន្ថែមឆ្នាំសិក្សាថ្មី"
            onAction={() => setDialogOpen(true)}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ឈ្មោះឆ្នាំសិក្សា</TableHead>
                <TableHead>ថ្ងៃចាប់ផ្តើម</TableHead>
                <TableHead>ថ្ងៃបញ្ចប់</TableHead>
                <TableHead>ស្ថានភាពប្រតិបត្តិការ</TableHead>
                <TableHead className="w-36 text-right">សកម្មភាព</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {years.map((ay) => (
                <TableRow key={ay.id}>
                  <TableCell className="font-semibold text-foreground">{ay.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{ay.startDate}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{ay.endDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={ay.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {ay.status !== "ACTIVE" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActivate(ay.id)}
                        className="text-xs border-primary/40 text-primary hover:bg-primary/10"
                      >
                        កំណត់ជាឆ្នាំសកម្ម
                      </Button>
                    )}
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
