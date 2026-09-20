"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Coffee, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // Automatically sign in
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-900/10 blur-[100px]" />

      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <Coffee className="h-10 w-10 text-gold-500" />
            <span className="text-3xl font-bold tracking-tighter text-gradient">AROMA RESTAURANT</span>
          </Link>
          <h1 className="mb-2 text-4xl font-bold">Create Account</h1>
          <p className="text-zinc-500">Join us to place orders and track your dining experience.</p>
        </div>

        <div className="glass-card rounded-[40px] p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-zinc-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sophia Martinez"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-4 outline-none transition-all focus:border-gold-500 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-zinc-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sophia@example.com"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-4 outline-none transition-all focus:border-gold-500 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-zinc-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-4 outline-none transition-all focus:border-gold-500 text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-600 py-4 text-lg font-bold text-black transition-all hover:scale-[1.02] hover:bg-gold-500 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"} <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-gold-500 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
