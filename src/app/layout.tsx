import type { Metadata } from "next";
import { Kantumruy_Pro, Noto_Sans_Khmer } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/features/auth";
import "./globals.css";

const kantumruy = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["khmer", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSansKhmer = Noto_Sans_Khmer({
  variable: "--font-noto-khmer",
  subsets: ["khmer", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "វិទ្យាល័យសំរោងពន្លៃ | Samrong Ponley High School",
    template: "%s | វិទ្យាល័យសំរោងពន្លៃ",
  },
  description:
    "ប្រព័ន្ធគ្រប់គ្រងសាលារៀន វិទ្យាល័យសំរោងពន្លៃ — Samrong Ponley High School Management System (ការគ្រប់គ្រងសិស្ស, គ្រូបង្រៀន, វត្តមាន, ពិន្ទុ, និងកាលវិភាគ)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="km"
      suppressHydrationWarning
      className={`${kantumruy.variable} ${notoSansKhmer.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider defaultTheme="system">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
