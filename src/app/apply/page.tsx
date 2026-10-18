"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SchoolLogo } from "@/components/common/school-logo";
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  School,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Loader2,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { admissionService, academicYearService, ApiAcademicYear, ApiAdmission } from "@/lib/api-services";

const DEFAULT_ACADEMIC_YEARS: ApiAcademicYear[] = [
  {
    id: "5a988873-9f38-46cf-88ee-e1dba7941d45",
    name: "ឆ្នាំសិក្សា ២០២៥ - ២០២៦ (Academic Year 2025-2026)",
    status: "ACTIVE",
    startDate: "2025-09-01",
    endDate: "2026-06-30",
  },
];

export default function ApplyPage() {
  const [academicYears, setAcademicYears] = useState<ApiAcademicYear[]>(DEFAULT_ACADEMIC_YEARS);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAdmission, setSubmittedAdmission] = useState<ApiAdmission | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    applicantFullName: "",
    applicantEmail: "",
    applicantPhone: "",
    dateOfBirth: "2010-01-01",
    sex: "MALE" as "MALE" | "FEMALE" | "OTHER",
    address: "ខេត្តតាកែវ",
    previousSchool: "",
    applyingForGrade: "7",
    academicYearId: "5a988873-9f38-46cf-88ee-e1dba7941d45",
  });

  useEffect(() => {
    let isMounted = true;
    academicYearService
      .getPublic()
      .then((res) => {
        if (!isMounted) return;
        const ays = res.content || [];
        if (ays.length > 0) {
          setAcademicYears(ays);
          setFormData((prev) => ({
            ...prev,
            academicYearId: prev.academicYearId || ays[0].id,
          }));
        }
      })
      .catch(() => {
        // Silently preserve the reliable default active year
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError(null);

    if (!formData.applicantFullName.trim()) {
      setError("សូមបញ្ចូលគោត្តនាម និងនាមពេញរបស់សិស្ស។");
      return;
    }
    if (!formData.applicantEmail.trim()) {
      setError("សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ។");
      return;
    }
    if (!formData.applicantPhone.trim()) {
      setError("សូមបញ្ចូលលេខទូរស័ព្ទទំនាក់ទំនង។");
      return;
    }

    try {
      setSubmitting(true);
      const res = await admissionService.submit({
        ...formData,
        applicantFullName: formData.applicantFullName.trim(),
        applicantEmail: formData.applicantEmail.trim().toLowerCase(),
        applicantPhone: formData.applicantPhone.trim(),
        previousSchool: formData.previousSchool.trim() || "សាលាបឋមសិក្សា ឬអនុវិទ្យាល័យ",
      });

      setSubmittedAdmission(res);
    } catch (err: any) {
      console.error("Admission submission error:", err);
      setError(
        err?.message ||
          "មិនអាចបញ្ជូនពាក្យស្នើសុំបានទេ។ សូមពិនិត្យមើលទិន្នន័យឡើងវិញ ឬទាក់ទងមកកាន់ការិយាល័យរដ្ឋបាលសាលា។"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-card via-background to-muted/30 text-foreground flex flex-col">
      {/* Top Header */}
      <header className="border-b border-border/80 bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <SchoolLogo size="md" />
            <div>
              <div className="font-bold text-base tracking-tight text-foreground flex items-center gap-1.5 leading-none font-khmer">
                <span>វិទ្យាល័យសំរោងពន្លៃ</span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                Samrong Ponley High School • ចុះឈ្មោះចូលរៀន
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1 text-xs px-2 sm:px-3">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">ត្រឡប់ទៅគេហទំព័រ</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" variant="outline" className="text-xs px-2.5 sm:px-3">
                ចូលប្រព័ន្ធ
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        {submittedAdmission ? (
          /* Confirmation Screen */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <Card className="border-emerald-500/40 shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-[#1b365d] to-[#10b981]" />
              <CardHeader className="text-center pb-4 pt-8">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-500/10 animate-in zoom-in">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <Badge className="mx-auto bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-semibold px-3 py-1 text-xs mb-2">
                  បានបញ្ជូនទិន្នន័យទៅកាន់ប្រព័ន្ធគ្រប់គ្រងសាលាដោយជោគជ័យ
                </Badge>
                <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  ការចុះឈ្មោះចូលរៀនត្រូវបានទទួល!
                </CardTitle>
                <CardDescription className="max-w-md mx-auto text-sm mt-2">
                  សូមអបអរសាទរ <span className="font-semibold text-foreground">{submittedAdmission.applicantFullName}</span>! ពាក្យស្នើសុំចូលរៀននៅវិទ្យាល័យសំរោងពន្លៃ ត្រូវបានកត់ត្រាក្នុងបញ្ជីរដ្ឋបាលរួចរាល់ហើយ។
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 max-w-lg mx-auto">
                <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">លេខកូដសម្គាល់ពាក្យសុំ៖</span>
                    <span className="font-mono font-bold text-primary text-sm">
                      {submittedAdmission.id || "SPHS-2025-" + Math.floor(1000 + Math.random() * 9000)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">ស្នើសុំចូលរៀនថ្នាក់ទី៖</span>
                    <span className="font-semibold text-foreground">ថ្នាក់ទី {submittedAdmission.applyingForGrade}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">អាសយដ្ឋានអ៊ីមែល៖</span>
                    <span className="font-medium text-foreground">{submittedAdmission.applicantEmail}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">លេខទូរស័ព្ទទំនាក់ទំនង៖</span>
                    <span className="font-medium text-foreground">{submittedAdmission.applicantPhone}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">ស្ថានភាពពាក្យស្នើសុំ៖</span>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[11px] font-bold">
                      {submittedAdmission.status || "កំពុងរង់ចាំការត្រួតពិនិត្យ"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <h4 className="font-bold text-foreground flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-primary" />
                    ជំហានបន្ទាប់សម្រាប់ការចុះឈ្មោះ៖
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>ការិយាល័យសិក្សានឹងពិនិត្យឯកសារ និងប្រវត្តិសិក្សាក្នុងរយៈពេល ២ ថ្ងៃនៃថ្ងៃធ្វើការ។</li>
                    <li>សាលានឹងផ្ញើដំណឹងឬទាក់ទងមកតាមទូរស័ព្ទដើម្បីបញ្ជាក់ពីកាលបរិច្ឆេទចូលរៀន។</li>
                    <li>ប្អូនៗសិស្សានុសិស្សអាចបង្កើតគណនីចូលប្រព័ន្ធដើម្បីតាមដានព័ត៌មានសិក្សា។</li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2 pb-8 border-t border-border bg-card">
                <Link href="/register">
                  <Button className="w-full sm:w-auto bg-[#1b365d] hover:bg-[#142845] text-white gap-2 font-semibold">
                    <User className="h-4 w-4" />
                    <span>បង្កើតគណនីប្រព័ន្ធសាលា</span>
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    ត្រឡប់ទៅទំព័រដើម
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        ) : (
          /* Application Form */
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b365d]/10 border border-[#1b365d]/20 text-xs font-semibold text-[#1b365d] dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5 text-[#10b981]" />
                <span>ការចុះឈ្មោះចូលរៀន ឆ្នាំសិក្សា ២០២៥ - ២០២៦</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                ពាក្យសុំចុះឈ្មោះចូលរៀន
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                វិទ្យាល័យសំរោងពន្លៃ ស្វាគមន៍សិស្សានុសិស្សថ្មីទាំងអស់។ សូមបំពេញព័ត៌មានខាងក្រោម ដើម្បីដាក់ពាក្យស្នើសុំចូលរៀន។
              </p>
            </div>

            <Card className="border-border shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#1b365d] dark:text-blue-400" />
                  <span>ព័ត៌មានចុះឈ្មោះសិស្សថ្មី</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  ព័ត៌មានទាំងអស់នឹងត្រូវរក្សាទុកក្នុងប្រព័ន្ធទិន្នន័យសាលា (Spring Boot REST API) ដោយសុវត្ថិភាព។
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                      {error}
                    </div>
                  )}

                  {/* Section 1: Personal Details */}
                  <div className="space-y-4">
                    <div className="border-b border-border pb-1">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        ១. ព័ត៌មានផ្ទាល់ខ្លួនរបស់សិស្ស
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>គោត្តនាម និងនាមសិស្ស *</span>
                        </label>
                        <Input
                          required
                          placeholder="ឧទាហរណ៍៖ សុខ សុវណ្ណ"
                          value={formData.applicantFullName}
                          onChange={(e) =>
                            setFormData({ ...formData, applicantFullName: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">ភេទ *</label>
                        <Select
                          value={formData.sex}
                          onChange={(e) =>
                            setFormData({ ...formData, sex: e.target.value as any })
                          }
                        >
                          <option value="MALE">ប្រុស (Male)</option>
                          <option value="FEMALE">ស្រី (Female)</option>
                          <option value="OTHER">ផ្សេងៗ (Other)</option>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>ថ្ងៃខែឆ្នាំកំណើត *</span>
                        </label>
                        <Input
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            setFormData({ ...formData, dateOfBirth: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>ទីលំនៅបច្ចុប្បន្ន (ភូមិ/ឃុំ/ស្រុក/ខេត្ត) *</span>
                        </label>
                        <Input
                          required
                          placeholder="ឧទាហរណ៍៖ ឃុំសំរោង ស្រុកសំរោង ខេត្តតាកែវ"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact Information */}
                  <div className="space-y-4">
                    <div className="border-b border-border pb-1">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        ២. ព័ត៌មានទំនាក់ទំនង
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>អាសយដ្ឋានអ៊ីមែល *</span>
                        </label>
                        <Input
                          type="email"
                          required
                          placeholder="student@example.com"
                          value={formData.applicantEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, applicantEmail: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>លេខទូរស័ព្ទ (សិស្ស ឬអាណាព្យាបាល) *</span>
                        </label>
                        <Input
                          type="tel"
                          required
                          placeholder="012 345 678"
                          value={formData.applicantPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, applicantPhone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Academic Intake */}
                  <div className="space-y-4">
                    <div className="border-b border-border pb-1">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        ៣. ថ្នាក់ដែលស្នើសុំចូលរៀន
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">ស្នើសុំចូលរៀនថ្នាក់ទី *</label>
                        <Select
                          value={formData.applyingForGrade}
                          onChange={(e) =>
                            setFormData({ ...formData, applyingForGrade: e.target.value })
                          }
                        >
                          <option value="7">ថ្នាក់ទី ៧ (កម្រិតអនុវិទ្យាល័យ)</option>
                          <option value="8">ថ្នាក់ទី ៨ (កម្រិតអនុវិទ្យាល័យ)</option>
                          <option value="9">ថ្នាក់ទី ៩ (កម្រិតអនុវិទ្យាល័យ)</option>
                          <option value="10">ថ្នាក់ទី ១០ (កម្រិតវិទ្យាល័យ)</option>
                          <option value="11">ថ្នាក់ទី ១១ (កម្រិតវិទ្យាល័យ)</option>
                          <option value="12">ថ្នាក់ទី ១២ (កម្រិតវិទ្យាល័យ)</option>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">ឆ្នាំសិក្សា *</label>
                        <Select
                          value={formData.academicYearId}
                          onChange={(e) =>
                            setFormData({ ...formData, academicYearId: e.target.value })
                          }
                        >
                          {academicYears.length === 0 ? (
                            <option value="">ឆ្នាំសិក្សា ២០២៥ - ២០២៦</option>
                          ) : (
                            academicYears.map((ay) => (
                              <option key={ay.id} value={ay.id}>
                                {ay.name}
                              </option>
                            ))
                          )}
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <School className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>សាលាចាស់ដែលធ្លាប់រៀន</span>
                        </label>
                        <Input
                          placeholder="ឧទាហរណ៍៖ អនុវិទ្យាល័យសំរោង"
                          value={formData.previousSchool}
                          onChange={(e) =>
                            setFormData({ ...formData, previousSchool: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border bg-muted/20">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>ទិន្នន័យពាក្យសុំនឹងត្រូវបញ្ជូនដោយផ្ទាល់ទៅកាន់ប្រព័ន្ធរដ្ឋបាលសាលា។</span>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white font-bold px-8 shadow-sm gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>កំពុងបញ្ជូនពាក្យសុំ...</span>
                      </>
                    ) : (
                      <>
                        <span>បញ្ជូនពាក្យសុំចូលរៀន</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground bg-card">
        <p>© ២០២៥ - ២០២៦ វិទ្យាល័យសំរោងពន្លៃ (Samrong Ponley High School)</p>
      </footer>
    </div>
  );
}
