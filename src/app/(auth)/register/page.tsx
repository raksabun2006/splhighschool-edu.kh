"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Lock, Mail, User, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth, authService } from "@/features/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | "PARENT" | "STAFF">("STUDENT");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    const submittedPassword = password;
    // Clear passwords from memory
    setPassword("");
    setConfirmPassword("");

    try {
      setLoading(true);
      // Public registration strictly submits safe public fields (never ADMIN or status)
      const userResponse = await authService.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: submittedPassword,
        sex,
        role,
      });

      if (userResponse && userResponse.id) {
        setSuccess(true);
        // Automatically authenticate user after registration
        try {
          await login({ email: email.trim().toLowerCase(), password: submittedPassword });
          setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        } catch {
          // If auto-login fails, redirect to login page
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please check your information or try another email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="relative inline-flex h-12 w-12 rounded-2xl bg-[#253c95] items-center justify-center text-white shadow-md mb-2">
            <GraduationCap className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#e53935] border-2 border-card" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
            <span>EduCoreKH</span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#e53935] text-white">
              ISTAD
            </span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Institute of Science and Technology Advanced Development
          </p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="space-y-1 pb-3">
            <CardTitle className="text-lg">Create an Account</CardTitle>
            <CardDescription>
              Register your high school profile with Spring Boot backend
            </CardDescription>
          </CardHeader>

          {/* New Student Study Registration Notice */}
          <div className="mx-6 mb-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary flex items-center justify-between gap-2">
            <div>
              <span className="font-semibold block text-foreground">New student registering to study?</span>
              <span className="text-[11px] text-muted-foreground">Submit your official academic admission intake</span>
            </div>
            <Link href="/apply">
              <Button size="sm" variant="default" className="text-xs h-7 bg-[#e53935] hover:bg-[#c62828] text-white shrink-0">
                Apply to Study
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-3.5">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Account registered successfully! Redirecting...</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    disabled={loading}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Bun Raksa"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Gender</label>
                  <Select
                    value={sex}
                    disabled={loading}
                    onChange={(e) => setSex(e.target.value as any)}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Account Role</label>
                  <Select
                    value={role}
                    disabled={loading}
                    onChange={(e) => setRole(e.target.value as any)}
                  >
                    <option value="STUDENT">Student Scholar</option>
                    <option value="TEACHER">Teacher / Faculty</option>
                    <option value="PARENT">Parent / Guardian</option>
                    <option value="STAFF">Staff / Registrar</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Password (min 8 chars)</label>
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full gap-2 h-10 mt-3 bg-[#253c95] hover:bg-[#1a2b6b] text-white">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Register Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="pt-0 flex flex-col space-y-3 text-center border-t border-border/60 mt-3 p-4">
            <div className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In Here
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
      </div>
    </div>
  );
}
