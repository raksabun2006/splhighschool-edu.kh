"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, GraduationCap, Menu, X, LayoutDashboard, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchoolLogo } from "@/components/common/school-logo";

const links = [
  { href: "/", label: "ទំព័រដើម" },
  { href: "/about", label: "អំពីសាលា" },
  { href: "/programs", label: "កម្មវិធីសិក្សា" },
  { href: "/apply", label: "ចុះឈ្មោះចូលរៀន" },
  { href: "/announcements", label: "សេចក្តីជូនដំណឹង" },
  { href: "/faculty", label: "លោកគ្រូ-អ្នកគ្រូ" },
  { href: "/contact", label: "ទំនាក់ទំនង" },
];

export function PublicPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="border-b border-[#162a4a] bg-[#1b365d] px-3 sm:px-4 py-2 text-center text-xs text-white">
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#10b981] align-middle animate-pulse" />
        <span className="font-semibold">ដំណឹងជ្រើសរើសសិស្សចូលរៀន ឆ្នាំសិក្សា ២០២៥ - ២០២៦៖</span>
        <Link href="/apply" className="ml-2 font-bold text-emerald-300 underline transition-colors hover:text-white">
          ចុះឈ្មោះចូលរៀនឥឡូវនេះ
        </Link>
      </div>
      <header className="sticky top-0 z-40 border-b border-[#cfd2d8] dark:border-slate-800 bg-[#e0e1e6] dark:bg-[#151921] shadow-2xs">
        <div className="mx-auto flex h-16 sm:h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <SchoolLogo size="sm" />
            <div className="min-w-0">
              <p className="truncate text-base sm:text-xl font-extrabold tracking-tight text-[#1b365d] dark:text-blue-400 font-khmer">
                វិទ្យាល័យសំរោងពន្លៃ
              </p>
              <p className="truncate text-[10px] font-medium tracking-wide text-slate-600 dark:text-slate-300 sm:text-[11px]">
                Samrong Ponley High School • ស្រុកអង្គរបុរី ខេត្តតាកែវ (Angkor Borei, Takeo)
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-5 xl:gap-6 text-sm font-medium text-muted-foreground lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 pb-1 transition-colors ${
                  pathname === link.href
                    ? "border-[#1b365d] font-semibold text-[#1b365d] dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <Link href="/apply" className="hidden sm:inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#1b365d] px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#142845] sm:px-4 sm:text-sm">
              <span>ចុះឈ្មោះចូលរៀន</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
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
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-[#1b365d]/10 text-[#1b365d] font-bold dark:text-blue-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button className="w-full bg-[#1b365d] text-white justify-center gap-2">
                  <span>ចុះឈ្មោះចូលរៀន</span>
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
      <main>
        <section className="border-b border-border/60 bg-gradient-to-b from-[#1b365d]/10 to-background px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">Samrong Ponley High School</p>
            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-[#1b365d] dark:text-blue-400 sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{description}</p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{children}</section>
      </main>
      <footer className="border-t border-border bg-card px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© ២០២៥ វិទ្យាល័យសំរោងពន្លៃ</span>
          <div className="flex gap-4"><Link href="/login" className="hover:text-foreground">ចូលប្រព័ន្ធ</Link><Link href="/dashboard" className="hover:text-foreground">ផ្ទាំងគ្រប់គ្រង</Link></div>
        </div>
      </footer>
    </div>
  );
}
