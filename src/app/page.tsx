"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SchoolLogo } from "@/components/common/school-logo";
import {
  GraduationCap,
  ArrowRight,
  Users,
  Award,
  Loader2,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Quote,
  School,
  LayoutDashboard,
  Megaphone,
  FlaskConical,
  Trophy,
  Sparkles,
  Compass,
  Menu,
  X,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  studentService,
  teacherService,
  classService,
  admissionService,
} from "@/lib/api-services";
import { useAuth } from "@/features/auth";

export default function HomePage() {
  const { isAuthenticated, user, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    admissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      studentService.getAll({ size: 1 }),
      teacherService.getAll({ size: 1 }),
      classService.getAll({ size: 1 }),
      admissionService.getAll({ size: 1 }),
    ]).then(([st, tc, cl, ad]) => {
      setStats({
        students: st.status === "fulfilled" ? st.value.totalElements : 0,
        teachers: tc.status === "fulfilled" ? tc.value.totalElements : 0,
        classes: cl.status === "fulfilled" ? cl.value.totalElements : 0,
        admissions: ad.status === "fulfilled" ? ad.value.totalElements : 0,
      });
      setLoading(false);
    });
  }, []);

  const academicTracks = [
    {
      id: "lower-secondary",
      grade: "ថ្នាក់ទី ៧ ដល់ ទី ៩",
      title: "កម្រិតអនុវិទ្យាល័យ (មូលដ្ឋានគ្រឹះ)",
      description:
        "ពង្រឹងចំណេះដឹងមូលដ្ឋានភាសាខ្មែរ គណិតវិទ្យា វិទ្យាសាស្ត្រ និងភាសាបរទេស ស្របតាមកម្មវិធីសិក្សាគោលរបស់ក្រសួងអប់រំ យុវជន និងកីឡា។",
      subjects: ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ភាសាអង់គ្លេស"],
      icon: BookOpen,
      badge: "ចំណេះទូទៅ",
    },
    {
      id: "upper-science",
      grade: "ថ្នាក់ទី ១០ ដល់ ទី ១២",
      title: "កម្រិតវិទ្យាល័យ (ផ្នែកវិទ្យាសាស្ត្រពិត)",
      description:
        "ផ្តោតស៊ីជម្រៅលើមុខវិជ្ជាគណិតវិទ្យា រូបវិទ្យា គីមីវិទ្យា និងជីវវិទ្យា ត្រៀមប្រឡងសញ្ញាបត្របាក់ឌុប និងអាហារូបករណ៍ថ្នាក់ឧត្តមសិក្សា។",
      subjects: ["គណិតកម្រិតខ្ពស់", "រូបវិទ្យាពិសោធន៍", "គីមីវិទ្យា", "ជីវវិទ្យា"],
      icon: FlaskConical,
      badge: "វិទ្យាសាស្ត្រពិត",
    },
    {
      id: "upper-social",
      grade: "ថ្នាក់ទី ១០ ដល់ ទី ១២",
      title: "កម្រិតវិទ្យាល័យ (ផ្នែកវិទ្យាសាស្ត្រសង្គម)",
      description:
        "ផ្តោតលើការអភិវឌ្ឍជំនាញវិភាគសង្គម ប្រវត្តិវិទ្យា ភូមិវិទ្យា សីលធម៌ពលរដ្ឋ និងសេដ្ឋកិច្ចវិទ្យា ដើម្បីកសាងភាពជាអ្នកដឹកនាំ។",
      subjects: ["ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋ", "សេដ្ឋកិច្ច"],
      icon: Compass,
      badge: "វិទ្យាសាស្ត្រសង្គម",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "ការបើកទទួលពាក្យចុះឈ្មោះចូលរៀន ឆ្នាំសិក្សា ២០២៥ - ២០២៦",
      date: "១០ កញ្ញា ២០២៥",
      category: "ការចុះឈ្មោះ",
      description:
        "វិទ្យាល័យសំរោងពន្លៃសូមជូនដំណឹងដល់មាតាបិតានិងសិស្សានុសិស្សទាំងអស់ ឲ្យបានជ្រាបអំពីការទទួលពាក្យចុះឈ្មោះចូលរៀនចាប់ពីថ្ងៃនេះតទៅ។",
      badgeVariant: "default",
    },
    {
      id: 2,
      title: "កាលវិភាគប្រឡងឆមាសលើកទី ១ សម្រាប់សិស្សគ្រប់កម្រិតថ្នាក់",
      date: "០៥ កញ្ញា ២០២៥",
      category: "ការប្រឡង",
      description:
        "ការិយាល័យសិក្សាសូមផ្សព្វផ្សាយកាលវិភាគនៃការប្រឡងឆមាសទី ១។ សូមសិស្សានុសិស្សទាំងអស់ត្រៀមខ្លួនឲ្យបានរួចរាល់។",
      badgeVariant: "secondary",
    },
    {
      id: 3,
      title: "កម្មវិធីប្រកួតប្រជែងសិស្សពូកែទូទាំងសាលា ប្រចាំឆ្នាំសិក្សា",
      date: "២៨ សីហា ២០២៥",
      category: "សកម្មភាព",
      description:
        "ការជ្រើសរើសបេក្ខជនឆ្នើមផ្នែកគណិតវិទ្យា រូបវិទ្យា និងអក្សរសាស្ត្រខ្មែរ ដើម្បីតំណាងសាលាក្នុងការប្រកួតថ្នាក់ស្រុកនិងខេត្ត។",
      badgeVariant: "outline",
    },
  ];

  const facultyMembers = [
    {
      name: "លោក សុខ ផល្លា",
      role: "នាយកវិទ្យាល័យ",
      degree: "បរិញ្ញាបត្រជាន់ខ្ពស់ អប់រំ",
      department: "គណៈគ្រប់គ្រងសាលា",
    },
    {
      name: "លោកស្រី ម៉ៅ សុគន្ធា",
      role: "នាយករងទទួលបន្ទុកសិក្សា",
      degree: "បរិញ្ញាបត្រ គរុកោសល្យ",
      department: "ការិយាល័យសិក្សា",
    },
    {
      name: "លោក គង់ វិចិត្រ",
      role: "ប្រធានដេប៉ាតឺម៉ង់គណិតវិទ្យា",
      degree: "គរុនិស្សិតជាន់ខ្ពស់",
      department: "ផ្នែកគណិតវិទ្យា",
    },
    {
      name: "អ្នកគ្រូ ចាន់ សុភា",
      role: "ប្រធានដេប៉ាតឺម៉ង់រូបវិទ្យា",
      degree: "បរិញ្ញាបត្រ រូបវិទ្យា",
      department: "ផ្នែកវិទ្យាសាស្ត្រ",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-[#1b365d]/20 selection:text-[#1b365d]">
      {/* Notification Banner */}
      <div className="bg-[#1b365d] text-white text-xs py-2 px-4 text-center border-b border-[#162a4a] flex items-center justify-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
        <span className="font-semibold">
          ដំណឹងជ្រើសរើសសិស្សចូលរៀន ឆ្នាំសិក្សា ២០២៥ - ២០២៦៖
        </span>
        <span className="hidden sm:inline text-white/90">
          វិទ្យាល័យសំរោងពន្លៃបើកទទួលពាក្យសុំចុះឈ្មោះចូលរៀនតាមប្រព័ន្ធឌីជីថល។
        </span>
        <Link
          href="/apply"
          className="underline font-bold text-emerald-300 hover:text-white transition-colors ml-1"
        >
          ចុះឈ្មោះចូលរៀនឥឡូវនេះ
        </Link>
      </div>

      {/* Main Navigation Header */}
      <header className="border-b border-[#cfd2d8] dark:border-slate-800 bg-[#e0e1e6] dark:bg-[#151921] sticky top-0 z-40 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 sm:gap-6 lg:gap-8">
          {/* School Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none shrink-0">
            <SchoolLogo size="md" />
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-base sm:text-lg md:text-xl tracking-tight text-[#1b365d] dark:text-blue-400 font-khmer leading-tight">
                វិទ្យាល័យសំរោងពន្លៃ
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide">
                Samrong Ponley High School
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-xs xl:text-sm font-medium text-slate-700 dark:text-slate-300">
            <Link
              href="/"
              className="text-[#1b365d] dark:text-blue-400 font-bold border-b-2 border-[#1b365d] dark:border-blue-400 pb-1"
            >
              ទំព័រដើម
            </Link>
            <Link
              href="/about"
              className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors pb-1 border-b-2 border-transparent"
            >
              អំពីសាលា
            </Link>
            <Link
              href="/programs"
              className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors pb-1 border-b-2 border-transparent"
            >
              កម្មវិធីសិក្សា
            </Link>
            <Link
              href="/apply"
              className="text-emerald-700 dark:text-emerald-400 font-semibold hover:text-emerald-800 transition-colors pb-1 border-b-2 border-transparent"
            >
              ចុះឈ្មោះចូលរៀន
            </Link>
            <Link
              href="/announcements"
              className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors pb-1 border-b-2 border-transparent"
            >
              សេចក្តីជូនដំណឹង
            </Link>
            <Link
              href="/faculty"
              className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors pb-1 border-b-2 border-transparent"
            >
              លោកគ្រូ-អ្នកគ្រូ
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors pb-1 border-b-2 border-transparent"
            >
              ទំនាក់ទំនង
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-[#1b365d] hover:bg-[#142845] text-white gap-1.5 sm:gap-2 font-semibold shadow-xs text-xs sm:text-sm px-2.5 sm:px-3.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>
                    {role === "STUDENT"
                      ? "ផ្ទាំងសិក្សាសិស្ស"
                      : role === "TEACHER"
                      ? "ផ្ទាំងគ្រូបង្រៀន"
                      : "ផ្ទាំងគ្រប់គ្រង"}
                  </span>
                  <ArrowRight className="h-4 w-4 hidden sm:inline" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3"
                  >
                    ចូលប្រព័ន្ធ
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button
                    size="sm"
                    className="bg-[#10b981] hover:bg-[#059669] text-white shadow-xs font-semibold px-3 sm:px-4 text-xs sm:text-sm"
                  >
                    ព័ត៌មានចូលរៀន
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? "បិទម៉ឺនុយ" : "បើកម៉ឺនុយ"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown (Borderless) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-0 bg-card px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-2xl">
            <div className="space-y-1">
              {[
                { href: "/", label: "ទំព័រដើម" },
                { href: "/about", label: "អំពីសាលា" },
                { href: "/programs", label: "កម្មវិធីសិក្សា" },
                { href: "/apply", label: "ចុះឈ្មោះចូលរៀន" },
                { href: "/announcements", label: "សេចក្តីជូនដំណឹង" },
                { href: "/faculty", label: "លោកគ្រូ-អ្នកគ្រូ" },
                { href: "/contact", label: "ទំនាក់ទំនង" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button className="w-full bg-[#10b981] hover:bg-[#059669] text-white justify-center gap-2">
                  <span>ចុះឈ្មោះចូលរៀនឥឡូវនេះ</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs gap-1.5 justify-center">
                    <LogIn className="h-3.5 w-3.5" />
                    <span>ចូលប្រព័ន្ធ</span>
                  </Button>
                </Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full text-xs gap-1.5 justify-center">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>ផ្ទាំងគ្រប់គ្រង</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-gradient-to-b from-card via-background to-muted/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1b365d]/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b365d]/10 border border-[#1b365d]/20 text-xs font-semibold text-[#1b365d] dark:text-blue-400">
                <School className="h-4 w-4 text-[#10b981]" />
                <span>ស្ថាប័នអប់រំចំណេះទូទៅឈានមុខ ខេត្តតាកែវ</span>
              </div>

              {/* Exact Prompt Hero Heading */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1b365d] dark:text-white leading-[1.2]">
                  វិទ្យាល័យសំរោងពន្លៃ
                </h1>
                <div className="text-xl sm:text-2xl font-bold text-muted-foreground tracking-wide">
                  Samrong Ponley High School
                </div>
              </div>

              {/* Exact Prompt Hero Subtitle */}
              <div className="text-lg sm:text-xl font-medium text-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed border-l-4 border-[#10b981] pl-4 py-1 text-left">
                ការអប់រំប្រកបដោយគុណភាព<br />
                សម្រាប់អនាគតសិស្សានុសិស្ស
              </div>

              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                បណ្តុះបណ្តាលសិស្សានុសិស្សឱ្យមានចំណេះដឹងទូលំទូលាយ វិន័យ សីលធម៌ថ្លៃថ្នូរ និងជំនាញបច្ចេកវិទ្យា ស្របតាមស្តង់ដារគុណភាពអប់រំជាតិ នៃព្រះរាជាណាចក្រកម្ពុជា។
              </p>

              {/* Exact Prompt CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button
                    size="lg"
                    className="h-12 px-7 bg-[#1b365d] hover:bg-[#142845] text-white font-bold text-base shadow-md hover:shadow-lg transition-all gap-2"
                  >
                    <span>ចូលប្រព័ន្ធ</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/apply">
                  <Button
                    size="lg"
                    className="h-12 px-7 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-base shadow-md hover:shadow-lg transition-all gap-2"
                  >
                    <span>ព័ត៌មានចូលរៀន</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-7 border-border text-foreground hover:bg-muted font-bold text-base transition-colors"
                  >
                    <span>ស្វែងយល់បន្ថែម</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                  <span>កម្មវិធីសិក្សាពេញលេញ ថ្នាក់ទី ៧-១២</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                  <span>បន្ទប់ពិសោធន៍វិទ្យាសាស្ត្រ និងកុំព្យូទ័រ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                  <span>គ្រូបង្រៀនមានគរុកោសល្យខ្ពស់</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Portal Snapshot Card with Real School Gate */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-card border border-border shadow-xl p-5 sm:p-6 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1b365d] via-[#10b981] to-[#1b365d]" />

                {/* Gate Photo Showcase Banner */}
                <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden mb-5 border border-border/80 shadow-inner group">
                  <Image
                    src="/images/samrong-ponley-gate.jpg"
                    alt="ខ្លោងទ្វារ និងបរិវេណវិទ្យាល័យសំរោងពន្លៃ"
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <SchoolLogo size="xs" />
                      <div>
                        <div className="text-white text-xs font-bold font-khmer leading-tight drop-shadow-md">
                          វិទ្យាល័យ សំរោងពន្លៃ
                        </div>
                        <div className="text-[10px] text-emerald-300 font-medium">
                          ច្រកទ្វារ និងបរិវេណសាលាផ្ទាល់
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500 text-white text-[10px] shadow-sm">
                      ទីតាំងពិតប្រាកដ
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-[#1b365d]/10 text-[#1b365d] dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      SPHS
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-foreground">
                        ទិន្នន័យប្រព័ន្ធគ្រប់គ្រងសាលា
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        ឆ្នាំសិក្សា ២០២៥ - ២០២៦
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-[#10b981] text-white hover:bg-[#059669] text-xs">
                    Live Railway API
                  </Badge>
                </div>

                <div className="mt-5 space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">
                          សិស្សានុសិស្សកំពុងសិក្សា
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          ទិន្នន័យពីបញ្ជីសាលាផ្ទាល់
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#1b365d]" />
                      ) : (
                        `${stats.students} នាក់`
                      )}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">
                          លោកគ្រូ-អ្នកគ្រូ
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          គរុនិស្សិត និងគ្រូឯកទេស
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#1b365d]" />
                      ) : (
                        `${stats.teachers} នាក់`
                      )}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <School className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">
                          ថ្នាក់រៀនសកម្ម
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          ថ្នាក់ទី ៧ ដល់ ទី ១២
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#1b365d]" />
                      ) : (
                        `${stats.classes} ថ្នាក់`
                      )}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">
                          ពាក្យសុំចុះឈ្មោះថ្មី
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          ការចុះឈ្មោះចូលរៀនឆ្នាំថ្មី
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#1b365d]" />
                      ) : (
                        `${stats.admissions} ពាក្យ`
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    ប្រព័ន្ធសុវត្ថិភាពទិន្នន័យសាលារៀន
                  </span>
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/login"}
                    className="font-bold text-[#1b365d] dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>ចូលផ្ទាំងគ្រប់គ្រង</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Ribbon */}
      <section className="bg-[#1b365d] text-white py-10 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/15">
          <div className="pt-4 md:pt-0 px-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-white/80" />
              ) : (
                stats.students
              )}
            </div>
            <div className="text-sm font-semibold text-white/95 mt-1">
              សិស្សានុសិស្សសរុប
            </div>
            <div className="text-xs text-white/70 mt-0.5">
              កំពុងទទួលការអប់រំ
            </div>
          </div>

          <div className="pt-4 md:pt-0 px-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-white/80" />
              ) : (
                stats.teachers
              )}
            </div>
            <div className="text-sm font-semibold text-white/95 mt-1">
              លោកគ្រូ-អ្នកគ្រូសរុប
            </div>
            <div className="text-xs text-white/70 mt-0.5">
              គ្រូបង្រៀនពេញម៉ោង
            </div>
          </div>

          <div className="pt-4 md:pt-0 px-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-white/80" />
              ) : (
                stats.classes
              )}
            </div>
            <div className="text-sm font-semibold text-white/95 mt-1">
              បន្ទប់ថ្នាក់រៀន
            </div>
            <div className="text-xs text-white/70 mt-0.5">
              ថ្នាក់ទី ៧ ដល់ ទី ១២
            </div>
          </div>

          <div className="pt-4 md:pt-0 px-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-white/80" />
              ) : (
                stats.admissions
              )}
            </div>
            <div className="text-sm font-semibold text-white/95 mt-1">
              ពាក្យចុះឈ្មោះថ្មី
            </div>
            <div className="text-xs text-white/70 mt-0.5">
              ឆ្នាំសិក្សា ២០២៥ - ២០២៦
            </div>
          </div>
        </div>
      </section>

      {/* School Introduction & Principal's Message Section */}
      <section id="about" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* School Intro */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10b981]">
              <span>ប្រវត្តិ និងចក្ខុវិស័យ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              អំពីវិទ្យាល័យសំរោងពន្លៃ
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              វិទ្យាល័យសំរោងពន្លៃ មានទីតាំងស្ថិតនៅស្រុកអង្គរបុរី ខេត្តតាកែវ (Angkor Borei, Takeo) ជាគ្រឹះស្ថានអប់រំចំណេះទូទៅកម្រិតមធ្យមសិក្សា ដែលមានបេសកកម្មចម្បងក្នុងការបណ្តុះបណ្តាលសិស្សានុសិស្សឱ្យទទួលបាននូវពុទ្ធិ សមត្ថភាព វិន័យ សីលធម៌ និងស្មារតីស្នេហាជាតិ។
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <strong className="font-semibold text-foreground">ចក្ខុវិស័យ៖</strong> ក្លាយជាវិទ្យាល័យគំរូនូវគុណភាពអប់រំ និងការអភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាដល់សិស្សជនបទ។
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#1b365d]/15 text-[#1b365d] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <strong className="font-semibold text-foreground">បេសកកម្ម៖</strong> ផ្តល់បរិយាកាសសិក្សាប្រកបដោយផាសុកភាព ទំនើប និងបង្រៀនស្របតាមស្តង់ដារក្រសួង។
                </div>
              </div>
            </div>
          </div>

          {/* Principal's Message Box */}
          <div className="lg:col-span-6">
            <div className="p-8 rounded-2xl bg-card border border-border shadow-md relative overflow-hidden">
              <Quote className="h-12 w-12 text-[#1b365d]/10 absolute top-6 right-6 pointer-events-none" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b365d]/10 text-xs font-bold text-[#1b365d] dark:text-blue-400 mb-4">
                <span>សារលិខិតរបស់លោកនាយក</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                "ការអប់រំគឺជាគ្រឹះដ៏រឹងមាំបំផុតក្នុងការកសាងអនាគត"
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic mb-6">
                «ក្នុងនាមគណៈគ្រប់គ្រងវិទ្យាល័យសំរោងពន្លៃ ខ្ញុំសូមស្វាគមន៍យ៉ាងកក់ក្តៅចំពោះសិស្សានុសិស្សនិងមាតាបិតាទាំងអស់។ យើងប្តេជ្ញាចិត្តយ៉ាងមុតមាំក្នុងការផ្តល់នូវការអប់រំប្រកបដោយគុណភាព សមភាព និងបរិយាបន្ន ដើម្បីឱ្យកូនៗក្លាយជាពលរដ្ឋល្អ ពោរពេញដោយចំណេះដឹង និងគុណធម៌សម្រាប់សង្គមជាតិ។»
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="h-11 w-11 rounded-full bg-[#1b365d] text-white flex items-center justify-center font-bold text-sm">
                  ស.ផ
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">
                    លោក សុខ ផល្លា
                  </div>
                  <div className="text-xs text-muted-foreground">
                    នាយកវិទ្យាល័យសំរោងពន្លៃ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs Section */}
      <section id="programs" className="py-16 bg-muted/40 border-y border-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10b981] mb-2">
                <span>កម្មវិធីអប់រំ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                កម្មវិធីសិក្សាចំណេះទូទៅ
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
                បណ្តុះបណ្តាលសិស្សានុសិស្សចាប់ពីថ្នាក់ទី ៧ ដល់ ទី ១២ ដោយបែងចែកជាផ្នែកវិទ្យាសាស្ត្រពិត និងវិទ្យាសាស្ត្រសង្គម។
              </p>
            </div>
            <Link href="/subjects">
              <Button
                variant="outline"
                className="gap-2 border-[#1b365d] text-[#1b365d] dark:text-blue-400 font-semibold"
              >
                <span>មើលមុខវិជ្ជាទាំងអស់</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {academicTracks.map((track) => {
              const IconComp = track.icon;
              return (
                <div
                  key={track.id}
                  className="rounded-2xl bg-card border border-border p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {track.grade}
                      </span>
                      <Badge className="bg-[#1b365d] text-white">
                        {track.badge}
                      </Badge>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-[#1b365d]/10 text-[#1b365d] dark:text-blue-400 flex items-center justify-center mb-3">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {track.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {track.description}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-foreground mb-2">
                      មុខវិជ្ជាគោលសំខាន់ៗ៖
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {track.subjects.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-muted border border-border text-foreground"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                    <Link href="/apply">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs text-[#1b365d] dark:text-blue-400 font-bold hover:bg-[#1b365d]/10 gap-1 justify-center"
                      >
                        <span>ចុះឈ្មោះចូលរៀនកម្រិតនេះ</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Announcements & School Activities Section */}
      <section id="announcements" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Latest Announcements */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10b981] mb-1">
                <span>ព័ត៌មានទាន់ហេតុការណ៍</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                សេចក្តីជូនដំណឹងថ្មីៗ
              </h2>
            </div>

            <div className="space-y-4">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-[#1b365d]/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-[#1b365d] dark:text-blue-400">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* School Activities & Facilities */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10b981] mb-1">
                <span>ជីវិតសិក្សា</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                សកម្មភាព & សម្ភារឧបទេស
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    បន្ទប់ពិសោធន៍វិទ្យាសាស្ត្រ
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    បំពាក់ដោយឧបករណ៍ពិសោធន៍រូបវិទ្យា គីមីវិទ្យា និងជីវវិទ្យា ជួយសិស្សយល់ច្បាស់ពីទ្រឹស្តីតាមរយៈការអនុវត្តជាក់ស្តែង។
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    បណ្ណាល័យឌីជីថល & សៀវភៅ
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    កន្លែងអានសៀវភៅ និងស្រាវជ្រាវឯកសារអេឡិចត្រូនិច សម្រាប់បំប៉នសមត្ថភាពសិស្សានុសិស្សគ្រប់ពេល។
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    ក្លឹបកីឡា និងសកម្មភាពសង្គម
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ទីលានបាល់ទាត់ បាល់ទះ និងកម្មវិធីអភិវឌ្ឍន៍យុវជនដើម្បីពង្រឹងសុខភាព និងការងារជាក្រុម។
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers / Faculty Section */}
      <section id="faculty" className="py-16 bg-muted/40 border-y border-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10b981]">
              លោកគ្រូ-អ្នកគ្រូ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
              គណៈគ្រប់គ្រង និងគ្រូបង្រៀនគំរូ
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              ក្រុមគ្រូបង្រៀនប្រកបដោយគរុកោសល្យខ្ពស់ និងការយកចិត្តទុកដាក់ខ្ពស់ចំពោះការលូតលាស់របស់សិស្ស។
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facultyMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card border border-border shadow-xs text-center space-y-3"
              >
                <div className="h-16 w-16 mx-auto rounded-full bg-[#1b365d] text-white flex items-center justify-center font-bold text-lg">
                  {member.name.slice(4, 6)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {member.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#10b981] mt-0.5">
                    {member.role}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {member.degree}
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {member.department}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Call to Action Banner */}
      <section className="bg-gradient-to-r from-[#1b365d] via-[#142845] to-[#0f1d33] text-white py-14 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-5 relative z-10">
          <Badge className="bg-[#10b981] text-white font-semibold mb-2">
            ការចុះឈ្មោះចូលរៀន ឆ្នាំសិក្សា ២០២៥ - ២០២៦
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ត្រៀមខ្លួនសម្រាប់អនាគតដ៏ភ្លឺស្វាងនៅវិទ្យាល័យសំរោងពន្លៃ
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            សិស្សានុសិស្សដែលបញ្ចប់ការសិក្សាថ្នាក់បឋមសិក្សា ឬអនុវិទ្យាល័យ អាចចុះឈ្មោះចូលរៀនតាមប្រព័ន្ធអនឡាញឥឡូវនេះ។
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link href="/apply">
              <Button
                size="lg"
                className="bg-[#10b981] hover:bg-[#059669] text-white font-bold h-12 px-8 shadow-lg gap-2"
              >
                <GraduationCap className="h-5 w-5" />
                <span>បំពេញពាក្យចុះឈ្មោះចូលរៀន</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-bold h-12 px-8"
              >
                ចូលប្រព័ន្ធសាលា
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Location & Contact Information Section */}
      <section id="contact" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10b981]">
              <span>ទំនាក់ទំនង & ទីតាំង</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              ព័ត៌មានទំនាក់ទំនងសាលា
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              សម្រាប់ព័ត៌មានបន្ថែមទាក់ទងនឹងការចុះឈ្មោះចូលរៀន ឬកិច្ចការសិក្សាទូទៅ លោកអ្នកអាចទាក់ទងមកកាន់ការិយាល័យរដ្ឋបាលនៃវិទ្យាល័យសំរោងពន្លៃ។
            </p>

            <div className="space-y-3 pt-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#1b365d] dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-foreground">អាសយដ្ឋាន៖</strong>
                  <br />
                  វិទ្យាល័យសំរោងពន្លៃ ស្រុកអង្គរបុរី ខេត្តតាកែវ (Angkor Borei, Takeo) ព្រះរាជាណាចក្រកម្ពុជា
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#1b365d] dark:text-blue-400 shrink-0" />
                <div>
                  <strong className="font-semibold text-foreground">ទូរស័ព្ទ៖</strong> +855 (0)97 888 1234 / +855 (0)12 777 888
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#1b365d] dark:text-blue-400 shrink-0" />
                <div>
                  <strong className="font-semibold text-foreground">អ៊ីមែល៖</strong> info.samrongponley@gmail.com
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-foreground">
                ម៉ោងបំពេញការងាររដ្ឋបាល
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span>ថ្ងៃចន្ទ - ថ្ងៃសុក្រ៖</span>
                  <span className="font-medium text-foreground">៧:០០ ព្រឹក - ១១:០០ ព្រឹក | ១:៣០ រសៀល - ៥:០០ ល្ងាច</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span>ថ្ងៃសៅរ៍៖</span>
                  <span className="font-medium text-foreground">៧:០០ ព្រឹក - ១១:៣០ ព្រឹក</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ថ្ងៃអាទិត្យ & ថ្ងៃបុណ្យជាតិ៖</span>
                  <span className="text-red-500 font-medium">ឈប់សម្រាក</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="bg-card border-t border-border pt-12 pb-8 text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-border">
            {/* Brand Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <SchoolLogo size="sm" />
                <div>
                  <div className="font-bold text-base text-[#1b365d] dark:text-blue-400 font-khmer">
                    វិទ្យាល័យសំរោងពន្លៃ
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Samrong Ponley High School
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ការអប់រំប្រកបដោយគុណភាព សីលធម៌ និងចំណេះដឹងទូលំទូលាយ ដើម្បីអនាគតដ៏ត្រចះត្រចង់របស់សិស្សានុសិស្ស។
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5">
              <div className="font-bold text-sm text-foreground">
                តំណភ្ជាប់រហ័ស
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">
                    ទំព័រដើម
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    អំពីវិទ្យាល័យ
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover:text-foreground transition-colors">
                    កម្មវិធីសិក្សា
                  </Link>
                </li>
                <li>
                  <Link href="/apply" className="hover:text-foreground transition-colors">
                    ចុះឈ្មោះចូលរៀន
                  </Link>
                </li>
              </ul>
            </div>

            {/* Management & System */}
            <div className="space-y-2.5">
              <div className="font-bold text-sm text-foreground">
                ប្រព័ន្ធគ្រប់គ្រងសាលា
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    ចូលប្រើប្រព័ន្ធ (Login)
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    ផ្ទាំងគ្រប់គ្រង (Dashboard)
                  </Link>
                </li>
                <li>
                  <Link href="/students" className="hover:text-foreground transition-colors">
                    បញ្ជីសិស្ស
                  </Link>
                </li>
                <li>
                  <Link href="/attendance" className="hover:text-foreground transition-colors">
                    កត់ត្រាវត្តមាន
                  </Link>
                </li>
              </ul>
            </div>

            {/* Location & Province */}
            <div className="space-y-2.5">
              <div className="font-bold text-sm text-foreground">
                ទីតាំងសាលា
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ស្រុកអង្គរបុរី ខេត្តតាកែវ (Angkor Borei, Takeo) ព្រះរាជាណាចក្រកម្ពុជា
              </p>
              <div className="text-xs text-muted-foreground">
                ទូរស័ព្ទ៖ +855 (0)97 888 1234
              </div>
              <div className="text-xs text-muted-foreground">
                អ៊ីមែល៖ info.samrongponley@gmail.com
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <p>
              © ២០២៥ - ២០២៦ វិទ្យាល័យសំរោងពន្លៃ (Samrong Ponley High School)។ រក្សាសិទ្ធិគ្រប់យ៉ាង។
            </p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-foreground transition-colors text-[#1b365d] dark:text-blue-400 font-medium">
                គណនីបុគ្គលិក / គ្រូ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
