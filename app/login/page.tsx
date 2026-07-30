// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/components/ToastContainer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Please enter an email address and password", "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem(
        "user_session",
        JSON.stringify({ email, loggedInAt: Date.now() }),
      );
      showToast(`Welcome back, ${email.split("@")[0]}!`, "success");
      router.push("/profiles");
    }, 500);
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem(
        "user_session",
        JSON.stringify({ email: demoEmail, loggedInAt: Date.now() }),
      );
      showToast(`Signed in as ${demoEmail}`, "success");
      router.push("/profiles");
    }, 500);
  };

  return (
    <div className="min-h-screen relative bg-[#141414] flex flex-col justify-between overflow-hidden">
      {/* Background Poster Wall with Netflix Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-black to-black opacity-90 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-black/80"></div>
      </div>

      {/* Header Logo Bar */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="text-3xl sm:text-4xl font-black text-red-600 tracking-tight">
          YOURU
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 my-auto">
        <div className="bg-black/85 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 rounded-2xl shadow-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">
              Sign In
            </h1>
            <p className="text-gray-400 text-xs font-light">
              Sign in to resume watching your favorite anime series.
            </p>
          </div>

          {/* Credentials Helper Info Card */}
          <div className="bg-[#1c1c1c] border border-red-500/30 rounded-xl p-4 space-y-2 text-xs">
            <span className="font-bold text-red-400 uppercase tracking-wider block text-[10px]">
              🔑 Demo Login Credentials:
            </span>
            <div className="flex justify-between items-center bg-[#141414] p-2 rounded border border-white/10 text-gray-300 font-mono text-[11px]">
              <span>user@youru.com</span>
              <span className="text-gray-500">youru123</span>
              <button
                type="button"
                onClick={() => handleQuickFill("user@youru.com", "youru123")}
                className="bg-red-600 text-white font-sans font-bold px-2 py-0.5 rounded text-[10px] hover:bg-red-700 transition"
              >
                Use
              </button>
            </div>
            <div className="flex justify-between items-center bg-[#141414] p-2 rounded border border-white/10 text-gray-300 font-mono text-[11px]">
              <span>admin@youru.com</span>
              <span className="text-gray-500">youru123</span>
              <button
                type="button"
                onClick={() => handleQuickFill("admin@youru.com", "youru123")}
                className="bg-red-600 text-white font-sans font-bold px-2 py-0.5 rounded text-[10px] hover:bg-red-700 transition"
              >
                Use
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-[#1c1c1c] text-white text-sm px-4 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/10 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#1c1c1c] text-white text-sm px-4 py-3.5 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition text-sm shadow-xl mt-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In &rarr;</span>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
              <span>Remember me</span>
            </label>
            <Link href="/help" className="hover:underline text-gray-300">
              Need help?
            </Link>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-gray-400 space-y-2">
            <p>
              New to YourU Cinema?{" "}
              <Link href="/register" className="text-white font-bold hover:underline">
                Sign up now
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-gray-600">
        © 2026 YourU Cinema, Inc. All rights reserved.
      </footer>
    </div>
  );
}
