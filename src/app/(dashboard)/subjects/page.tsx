"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { subjectService, ApiSubject } from "@/lib/api-services";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    credit: 4,
  });

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await subjectService.getAll({ keyword: searchTerm || undefined });
      setSubjects(res.content || []);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [searchTerm]);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await subjectService.create({
        ...formData,
        credit: Number(formData.credit),
      });
      setDialogOpen(false);
      setFormData({ code: "", name: "", description: "", credit: 4 });
      fetchSubjects();
    } catch (err: any) {
      alert(err?.message || "Failed to create subject.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបមុខវិជ្ជាសិក្សានេះចេញពីប្រព័ន្ធមែនទេ?")) return;
    try {
      await subjectService.delete(id);
      fetchSubjects();
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការលុបមុខវិជ្ជា");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="មុខវិជ្ជា & កម្មវិធីសិក្សា"
        description="បញ្ជីមុខវិជ្ជាសិក្សាថ្នាក់វិទ្យាល័យ និងក្រេឌីត/ម៉ោងបង្រៀននៃវិទ្យាល័យសំរោងពន្លៃ (Spring Boot API /api/v1/subjects)"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              <span>បន្ថែមមុខវិជ្ជាថ្មី</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleCreateSubject}>
              <DialogHeader>
                <DialogTitle>បន្ថែមមុខវិជ្ជាថ្មី</DialogTitle>
                <DialogDescription>
                  បញ្ចូលមុខវិជ្ជាថ្មីទៅក្នុងកម្មវិធីសិក្សារបស់វិទ្យាល័យសំរោងពន្លៃ។
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">កូដមុខវិជ្ជា (Code)</label>
                    <Input
                      required
                      placeholder="ឧ. MTH-101"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">ចំនួនក្រេឌីត / ម៉ោង</label>
                    <Input
                      type="number"
                      required
                      min={1}
                      value={formData.credit}
                      onChange={(e) => setFormData({ ...formData, credit: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">ឈ្មោះមុខវិជ្ជា</label>
                  <Input
                    required
                    placeholder="ឧ. គណិតវិទ្យា, រូបវិទ្យា, ភាសាខ្មែរ..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">ការពិពណ៌នាសង្ខេប</label>
                  <Input
                    placeholder="មាតិកាសំខាន់ៗនៃមុខវិជ្ជា..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>បោះបង់</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "កំពុងរក្សាទុក..." : "រក្សាទុកមុខវិជ្ជា"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ស្វែងរកតាមឈ្មោះមុខវិជ្ជា ឬកូដមុខវិជ្ជា..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : subjects.length === 0 ? (
          <EmptyState
            title="មិនមានទិន្នន័យមុខវិជ្ជាទេ"
            description="បច្ចុប្បន្នមិនទាន់មានទិន្នន័យមុខវិជ្ជាណាមួយក្នុងកម្មវិធីសិក្សាឡើយ។"
            actionLabel="បន្ថែមមុខវិជ្ជាថ្មី"
            onAction={() => setDialogOpen(true)}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">កូដមុខវិជ្ជា</TableHead>
                <TableHead>ឈ្មោះមុខវិជ្ជា</TableHead>
                <TableHead>ការពិពណ៌នាសង្ខេប</TableHead>
                <TableHead>ក្រេឌីត / ម៉ោង</TableHead>
                <TableHead>ស្ថានភាព</TableHead>
                <TableHead className="w-16 text-right">សកម្មភាព</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-mono font-bold text-primary">
                    {subject.code}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {subject.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {subject.description || "-"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{subject.credit} ក្រេឌីត</TableCell>
                  <TableCell>
                    <StatusBadge status={subject.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
