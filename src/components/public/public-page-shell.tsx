"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, GraduationCap } from "lucide-react";

const links = [
  { href: "/", label: "ទំព័រដើម" },
  { href: "/about", label: "អំពីសាលា" },
  { href: "/programs", label: "កម្មវិធីសិក្សា" },
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-[#162a4a] bg-[#1b365d] px-4 py-2 text-center text-xs text-white">
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#10b981] align-middle" />
        <span className="font-semibold">ដំណឹងជ្រើសរើសសិស្សចូលរៀន ឆ្នាំសិក្សា ២០២៥ - ២០២៦៖</span>
        <Link href="/apply" className="ml-2 font-bold text-emerald-300 underline transition-colors hover:text-white">
          ចុះឈ្មោះចូលរៀនឥឡូវនេះ
        </Link>
      </div>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1b365d] text-white shadow-md transition-transform hover:scale-105">
              <GraduationCap className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-[#10b981]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold tracking-tight text-[#1b365d] dark:text-blue-400 sm:text-xl">
                វិទ្យាល័យសំរោងពន្លៃ
              </p>
              <p className="truncate text-[10px] font-medium tracking-wide text-muted-foreground sm:text-[11px]">
                Samrong Ponley High School • ស្រុកសំរោង ខេត្តតាកែវ
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
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
          <Link href="/apply" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#1b365d] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#142845] sm:px-4 sm:text-sm">
            <span className="hidden sm:inline">ចុះឈ្មោះចូលរៀន</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
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
