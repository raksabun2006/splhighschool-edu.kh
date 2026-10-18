"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, ArrowRight, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { SchoolLogo } from "@/components/common/school-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/features/auth";
import { getSafeRedirectUrl } from "@/lib/auth/redirect";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    if (searchParams.get("error") === "session_expired") {
      return "Your session has expired. Please sign in again.";
    }
    return null;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    const submittedPassword = password;
    // Clear password state from memory promptly
    setPassword("");

    try {
      const response = await login({ email, password: submittedPassword });
      if (response && response.accessToken) {
        const rawRedirect = searchParams.get("redirect");
        const safeDestination = getSafeRedirectUrl(rawRedirect, "/dashboard");
        router.push(safeDestination);
      } else {
        setError("Invalid authentication response received.");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid email or password. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-border">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg">Account Login</CardTitle>
        <CardDescription>
          Enter your credentials to authenticate with the Spring Boot backend
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.edu.kh"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full gap-2 h-10 mt-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="pt-0 flex flex-col space-y-3 text-center border-t border-border/60 mt-4 p-4">
        <div className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register Here
          </Link>
        </div>
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to EduCoreKH Home
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <SchoolLogo size="xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
            <span>EduCoreKH</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              SPL
            </span>
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Samrong Ponley High School Management System
          </p>
          <p className="text-[11px] text-muted-foreground/80 font-khmer">
            ប្រព័ន្ធគ្រប់គ្រងសាលារៀន វិទ្យាល័យ សំរោងពន្លៃ
          </p>
        </div>

        <Suspense fallback={
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
