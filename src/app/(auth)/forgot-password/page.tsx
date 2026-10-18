import Link from "next/link";
import { GraduationCap, ArrowLeft, Mail, Send } from "lucide-react";
import { SchoolLogo } from "@/components/common/school-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <SchoolLogo size="xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Password Recovery
          </h1>
          <p className="text-xs text-muted-foreground">
            Reset access to your EduCoreKH account
          </p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Forgot Password</CardTitle>
            <CardDescription>
              Enter your registered school email to receive a recovery link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@educorekh.edu"
                  className="pl-9"
                />
              </div>
            </div>

            <Link href="/reset-password" className="block w-full pt-2">
              <Button className="w-full gap-2 h-10">
                <Send className="h-4 w-4" />
                <span>Send Recovery Email</span>
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="pt-0 flex justify-center border-t border-border/60 mt-4 p-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
