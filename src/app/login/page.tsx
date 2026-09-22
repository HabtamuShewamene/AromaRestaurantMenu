"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ChefHat, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-900/10 blur-[100px]" />

      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <Link href="/" className="mb-8 inline-flex items-center gap-2">
            <div className="flex items-center justify-center w-14 h-14 relative">
              <img src="/aroma-logo.png?v=3" alt="Aroma Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold tracking-tight text-foreground font-playfair">AROMA</span>
              <span className="text-[9px] tracking-[0.25em] text-primary font-semibold uppercase -mt-1">Restaurant</span>
            </div>
          </Link>
          <h1 className="mb-2 text-4xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to manage your orders or access admin features.</p>
        </div>

        <div className="glass-card rounded-[40px] p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-muted-foreground">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full rounded-2xl border border-border bg-card px-6 py-4 outline-none transition-all focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full rounded-2xl border border-border bg-card px-6 py-4 outline-none transition-all focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-[1.02] hover:bg-brand-700 active:scale-[0.98]"
            >
              Sign In <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-primary hover:underline">
              Sign up now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
