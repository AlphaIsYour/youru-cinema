// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/components/ToastContainer";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem(
        "user_session",
        JSON.stringify({ name, email, loggedInAt: Date.now() }),
      );
      showToast("Account created successfully! Choose your profile.", "success");
      router.push("/profiles");
    }, 600);
  };

  return (
    <div className="min-h-screen relative bg-[#141414] flex flex-col justify-between overflow-hidden">
      {/* Background Poster Wall */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-black to-black opacity-90 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-black/80"></div>
      </div>

      {/* Header Bar */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="text-3xl sm:text-4xl font-black text-red-600 tracking-tight">
          YOURU
        </Link>
        <Link href="/login" className="text-xs font-bold text-white hover:underline">
          Sign In
        </Link>
      </header>

      {/* Main Register Form Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 my-auto">
        <div className="bg-black/85 backdrop-blur-2xl border border-white/10 p-8 sm:p-14 rounded-2xl shadow-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">
              Create Account
            </h1>
            <p className="text-gray-400 text-xs font-light">
              Unlimited anime streaming. Create your account in 1 minute.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-[#1c1c1c] text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/10 transition"
              />
            </div>

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
                className="w-full bg-[#1c1c1c] text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/10 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full bg-[#1c1c1c] text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/10 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-[#1c1c1c] text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/10 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition text-sm shadow-xl mt-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Membership &rarr;</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-xs text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-bold hover:underline">
              Sign in
            </Link>
            .
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-gray-600">
        © 2026 YourU Cinema, Inc. All rights reserved.
      </footer>
    </div>
  );
}
