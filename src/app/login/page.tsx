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
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-900/10 blur-[100px]" />

      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <Link href="/" className="mb-8 inline-flex items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-500/15 border border-gold-500/30 shadow-[0_0_20px_rgba(182,141,64,0.2)]">
              <ChefHat className="h-7 w-7 text-gold-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold tracking-tight text-white font-playfair">AROMA</span>
              <span className="text-[9px] tracking-[0.25em] text-gold-500 font-semibold uppercase -mt-1">Restaurant</span>
            </div>
          </Link>
          <h1 className="mb-2 text-4xl font-bold">Welcome Back</h1>
          <p className="text-zinc-500">Sign in to manage your orders or access admin features.</p>
        </div>

        <div className="glass-card rounded-[40px] p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-zinc-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-4 outline-none transition-all focus:border-gold-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-zinc-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-4 outline-none transition-all focus:border-gold-500"
                required
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-600 py-4 text-lg font-bold text-black transition-all hover:scale-[1.02] hover:bg-gold-700 active:scale-[0.98]"
            >
              Sign In <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-gold-500 hover:underline">
              Sign up now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
