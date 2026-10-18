"use client";

import React, { useState, useEffect } from "react";
import { Plus, UserPlus, ShieldCheck, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/status-badge";
import { authService, ApiUser } from "@/lib/api-services";

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    sex: "MALE" as "MALE" | "FEMALE" | "OTHER",
    role: "TEACHER" as "ADMIN" | "PRINCIPAL" | "TEACHER" | "STUDENT" | "PARENT" | "STAFF",
  });

  const loadCurrentUser = () => {
    authService.getMe()
      .then((user) => setCurrentUser(user))
      .catch((err) => console.error("Failed to fetch current user:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      alert("ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងតិច ៨ តួអក្សរ។");
      return;
    }

    try {
      setSubmitting(true);
      await authService.register(formData);
      alert("បានបង្កើតគណនីអ្នកប្រើប្រាស់ថ្មីក្នុងប្រព័ន្ធជោគជ័យ!");
      setDialogOpen(false);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        sex: "MALE",
        role: "TEACHER",
      });
      loadCurrentUser();
    } catch (err: any) {
      alert(err?.message || "បរាជ័យក្នុងការចុះឈ្មោះគណនី");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="គណនីអ្នកប្រើប្រាស់ & សិទ្ធិចូលប្រើ"
        description="គ្រប់គ្រងគណនីអ្នកគ្រប់គ្រង លោកគ្រូ-អ្នកគ្រូ និងបុគ្គលិកនៃវិទ្យាល័យសំរោងពន្លៃ (Spring Boot API /api/v1/auth/me)"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <UserPlus className="h-4 w-4" />
              <span>បង្កើតគណនីថ្មី</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleRegisterUser}>
              <DialogHeader>
                <DialogTitle>ចុះឈ្មោះគណនីអ្នកប្រើប្រាស់ថ្មី</DialogTitle>
                <DialogDescription>
                  បង្កើតគណនី និងកំណត់តួនាទីក្នុងប្រព័ន្ធវិទ្យាល័យសំរោងពន្លៃ។
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">ឈ្មោះពេញរបស់អ្នកប្រើប្រាស់</label>
                  <Input
                    required
                    placeholder="ឧ. សុខ ដារ៉ា"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">អាសយដ្ឋានអ៊ីមែល (Email)</label>
                  <Input
                    type="email"
                    required
                    placeholder="user@samrongponley.edu.kh"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">ភេទ</label>
                  <Select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as "MALE" | "FEMALE" | "OTHER" })}
                  >
                    <option value="MALE">ប្រុស</option>
                    <option value="FEMALE">ស្រី</option>
                    <option value="OTHER">ផ្សេងៗ</option>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">តួនាទីក្នុងប្រព័ន្ធ (System Role)</label>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  >
                    <option value="TEACHER">លោកគ្រូ / អ្នកគ្រូបង្រៀន (TEACHER)</option>
                    <option value="ADMIN">អ្នកគ្រប់គ្រងជាន់ខ្ពស់ (ADMIN)</option>
                    <option value="PRINCIPAL">នាយក / នាយិកាសាលា (PRINCIPAL)</option>
                    <option value="STAFF">បុគ្គលិករដ្ឋបាល (STAFF)</option>
                    <option value="STUDENT">សិស្សានុសិស្ស (STUDENT)</option>
                    <option value="PARENT">អាណាព្យាបាល (PARENT)</option>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">ពាក្យសម្ងាត់ (យ៉ាងតិច ៨ តួអក្សរ)</label>
                  <Input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  បោះបង់
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "កំពុងចុះឈ្មោះ..." : "ចុះឈ្មោះគណនី"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {currentUser ? (
          <>
            {/* Mobile View */}
            <div className="block md:hidden p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{currentUser.fullName}</h4>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary mt-1">
                    {currentUser.role}
                  </span>
                </div>
                <StatusBadge status={currentUser.status} />
              </div>
              <div className="text-xs text-muted-foreground font-mono pt-1 border-t border-border/50">
                {currentUser.email}
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ឈ្មោះពេញរបស់អ្នកប្រើប្រាស់</TableHead>
                    <TableHead>អាសយដ្ឋានអ៊ីមែល</TableHead>
                    <TableHead>តួនាទីក្នុងប្រព័ន្ធ</TableHead>
                    <TableHead>ស្ថានភាពគណនី</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key={currentUser.id}>
                    <TableCell className="font-semibold text-foreground">
                      {currentUser.fullName}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {currentUser.email}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                        {currentUser.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={currentUser.status} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-xs">
            {loading ? "កំពុងទាញយកព័ត៌មានគណនី..." : "មិនមានវគ្គចូលប្រើប្រាស់សកម្មឡើយ"}
          </div>
        )}
      </div>
    </div>
  );
}
