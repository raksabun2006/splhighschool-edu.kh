"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal } from "lucide-react";
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
import { parentService, studentService, ApiParent, ApiStudent } from "@/lib/api-services";

export default function ParentsPage() {
  const [parents, setParents] = useState<ApiParent[]>([]);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    occupation: "",
    address: "Phnom Penh",
    studentId: "",
  });

  const fetchParents = async () => {
    try {
      setLoading(true);
      const res = await parentService.getAll({ keyword: searchTerm || undefined });
      setParents(res.content || []);
    } catch (err) {
      console.error("Failed to fetch parents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
    studentService.getAll().then((res) => {
      setStudents(res.content || []);
      if (res.content && res.content.length > 0) {
        setFormData((prev) => ({ ...prev, studentId: res.content[0].id }));
      }
    }).catch(console.error);
  }, [searchTerm]);

  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await parentService.create({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        occupation: formData.occupation,
        address: formData.address,
        studentIds: formData.studentId ? [formData.studentId] : [],
      } as any);
      setDialogOpen(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        occupation: "",
        address: "Phnom Penh",
        studentId: students[0]?.id || "",
      });
      fetchParents();
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការបង្កើតអាណាព្យាបាល");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="អាណាព្យាបាល & ឪពុកម្តាយសិស្ស"
        description="បញ្ជីរាយនាមអាណាព្យាបាល និងព័ត៌មានកូនៗដែលកំពុងសិក្សានៅវិទ្យាល័យសំរោងពន្លៃ (Spring Boot API /api/v1/parents)"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              <span>បន្ថែមអាណាព្យាបាលថ្មី</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleCreateParent}>
              <DialogHeader>
                <DialogTitle>ចុះឈ្មោះអាណាព្យាបាលថ្មី</DialogTitle>
                <DialogDescription>
                  បញ្ចូលព័ត៌មានអាណាព្យាបាល និងភ្ជាប់ទំនាក់ទំនងជាមួយសិស្សានុសិស្សក្នុងប្រព័ន្ធ។
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">ឈ្មោះពេញអាណាព្យាបាល</label>
                  <Input
                    required
                    placeholder="ឧ. សុខ ជា"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">អ៊ីមែល (Email)</label>
                    <Input
                      type="email"
                      required
                      placeholder="parent@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">លេខទូរស័ព្ទ</label>
                    <Input
                      placeholder="012 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">សិស្សដែលជាកូន (កូនសិស្សក្នុងបន្ទុក)</label>
                  <select
                    className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  >
                    <option value="">-- ជ្រើសរើសសិស្សដែលត្រូវភ្ជាប់ --</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.fullName} ({st.studentCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">មុខរបរ / អាជីព</label>
                  <Input
                    placeholder="ឧ. វិស្វករ, អាជីវករ, កសិករ..."
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>បោះបង់</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "កំពុងរក្សាទុក..." : "រក្សាទុកព័ត៌មាន"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ស្វែងរកអាណាព្យាបាលតាមឈ្មោះ អ៊ីមែល ឬលេខទូរស័ព្ទ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={3} cols={5} />
        ) : parents.length === 0 ? (
          <EmptyState
            title="មិនមានទិន្នន័យអាណាព្យាបាលទេ"
            description="បច្ចុប្បន្នមិនទាន់មានទិន្នន័យអាណាព្យាបាលណាមួយដែលត្រូវគ្នានឹងការស្វែងរកឡើយ។"
            actionLabel="បន្ថែមអាណាព្យាបាលថ្មី"
            onAction={() => setDialogOpen(true)}
          />
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block md:hidden divide-y divide-border">
              {parents.map((parent) => (
                <div key={parent.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">
                        {parent.fullName}
                      </h4>
                      <p className="text-xs text-muted-foreground">{parent.occupation || "គ្មានព័ត៌មានមុខរបរ"}</p>
                    </div>
                    <StatusBadge status={parent.status} />
                  </div>

                  <div className="space-y-1 text-xs pt-1 border-t border-border/50">
                    <span className="block text-[11px] text-muted-foreground/70">កូនសិស្សក្នុងបន្ទុក</span>
                    {parent.children && parent.children.length > 0 ? (
                      parent.children.map((c) => (
                        <div key={c.id} className="font-semibold text-foreground">
                          {c.fullName} ({c.studentCode})
                        </div>
                      ))
                    ) : (
                      <span className="text-muted-foreground">មិនទាន់ភ្ជាប់សិស្ស</span>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground pt-1 border-t border-border/50 break-all">
                    <span>{parent.email}</span>
                    {parent.phone && <span className="block text-foreground font-mono">{parent.phone}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ឈ្មោះអាណាព្យាបាល & មុខរបរ</TableHead>
                    <TableHead>កូនៗដែលកំពុងសិក្សា</TableHead>
                    <TableHead>អ៊ីមែល</TableHead>
                    <TableHead>លេខទូរស័ព្ទ</TableHead>
                    <TableHead>ស្ថានភាព</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parents.map((parent) => (
                    <TableRow key={parent.id}>
                      <TableCell className="font-medium text-foreground">
                        <div>{parent.fullName}</div>
                        <div className="text-[11px] text-muted-foreground">{parent.occupation || "-"}</div>
                      </TableCell>
                      <TableCell>
                        {parent.children && parent.children.length > 0 ? (
                          parent.children.map((c) => (
                            <div key={c.id} className="text-xs font-semibold text-foreground">
                              {c.fullName} ({c.studentCode})
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">មិនទាន់ភ្ជាប់សិស្ស</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs font-mono">{parent.email}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{parent.phone || "-"}</TableCell>
                      <TableCell>
                        <StatusBadge status={parent.status} />
                      </TableCell>
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
