"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
<<<<<<< HEAD
import { Coffee, ArrowRight, UserPlus, LogIn } from "lucide-react";
=======
import { ChefHat, ArrowRight } from "lucide-react";
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      setSuccessMessage("Account created successfully! Signing you in...");

      // Automatically sign in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.error) {
        router.push("/");
        router.refresh();
      } else {
        setIsRegister(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 bg-[#080808]">
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-900/10 blur-[120px]" />

      <div className="w-full max-w-md">
<<<<<<< HEAD
        <div className="mb-10 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <Coffee className="h-10 w-10 text-gold-500" />
            <span className="text-3xl font-bold tracking-tighter text-gradient">ELITE CAFE</span>
=======
        <div className="mb-12 text-center">
          <Link href="/" className="mb-8 inline-flex items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-500/15 border border-gold-500/30 shadow-[0_0_20px_rgba(182,141,64,0.2)]">
              <ChefHat className="h-7 w-7 text-gold-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold tracking-tight text-white font-playfair">AROMA</span>
              <span className="text-[9px] tracking-[0.25em] text-gold-500 font-semibold uppercase -mt-1">Restaurant</span>
            </div>
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-white">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-zinc-500 text-sm">
            {isRegister
              ? "Join Elite Café to place orders and customize your experience."
              : "Sign in to manage your orders or access admin features."}
          </p>
        </div>

        {/* Tab switch */}
        <div className="mb-6 flex rounded-2xl bg-zinc-950 p-1.5 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError("");
              setSuccessMessage("");
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              !isRegister
                ? "bg-gold-500 text-black shadow-lg"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LogIn className="h-4 w-4" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError("");
              setSuccessMessage("");
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              isRegister
                ? "bg-gold-500 text-black shadow-lg"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <UserPlus className="h-4 w-4" /> Register
          </button>
        </div>

        <div className="glass-card rounded-[32px] p-8 sm:p-10 border border-white/5">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-400">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-medium text-green-400">
              {successMessage}
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleSignIn} className="space-y-5">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3.5 text-sm outline-none transition-all focus:border-gold-500 text-white"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3.5 text-sm outline-none transition-all focus:border-gold-500 text-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3.5 text-sm outline-none transition-all focus:border-gold-500 text-white"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-600 py-4 text-base font-bold text-black transition-all hover:bg-gold-500 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                "Please wait..."
              ) : isRegister ? (
                <>Create Account <ArrowRight className="h-5 w-5" /></>
              ) : (
                <>Sign In <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
          </form>
<<<<<<< HEAD
=======

          <div className="mt-8 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-gold-500 hover:underline">
              Sign up now
            </Link>
          </div>
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
        </div>
      </div>
    </div>
  );
}
