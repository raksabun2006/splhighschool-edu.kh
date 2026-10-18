import Link from "next/link";
import { GraduationCap, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { SchoolLogo } from "@/components/common/school-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <SchoolLogo size="xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Set New Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Create a secure password for EduCoreKH
          </p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Reset Password</CardTitle>
            <CardDescription>
              Must contain at least 8 characters with numbers and letters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Re-enter new password"
                  className="pl-9"
                />
              </div>
            </div>

            <Link href="/login" className="block w-full pt-2">
              <Button className="w-full gap-2 h-10">
                <CheckCircle2 className="h-4 w-4" />
                <span>Update Password</span>
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="pt-0 flex justify-center border-t border-border/60 mt-4 p-4">
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel and Return to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
