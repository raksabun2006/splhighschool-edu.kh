import Link from "next/link";
import { GraduationCap, ArrowLeft, Home } from "lucide-react";
import { SchoolLogo } from "@/components/common/school-logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="mb-6">
        <SchoolLogo size="xl" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">404</h1>
      <h2 className="text-xl font-semibold mt-2 text-foreground">Page Not Found</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        The page you are looking for does not exist, or has been moved within EduCoreKH.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/dashboard">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            <span>Go to Dashboard</span>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
