"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Mail, Lock, ArrowLeft, Shield, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Send token to API to set cookie
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const data = await response.json();
        setError(data.message || "Authentication failed. Please verify credentials.");
      }
    } catch (err: any) {
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email address or password.");
      } else if (err.code === "auth/user-not-found") {
        setError("No registered administrator account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password entered.");
      } else {
        setError("An authentication error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071324] via-[#0e2343] to-[#163967] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 relative rounded-2xl bg-[#163967]/5 flex items-center justify-center p-2.5 border border-[#163967]/10">
              <Image
                src="/images/logo/logo-alsa-unsrat.png"
                alt="ALSA LC Unsrat Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#163967] bg-[#163967]/10 px-3 py-1 rounded-full">
              Administrative Console
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-3 tracking-tight">
              ALSA LC UNSRAT
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage timeline, leadership boards, programs, and legal resources.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium px-4 py-3 rounded-xl flex items-start gap-2.5">
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alsalcunsrat.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#163967] hover:bg-[#112d52] text-white font-semibold rounded-xl text-sm shadow-md shadow-[#163967]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Authenticating...
                </>
              ) : (
                <>
                  <Shield size={16} /> Access Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#163967] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Public Website
            </Link>
          </div>
        </div>

        {/* Security watermark */}
        <p className="text-center text-[11px] text-white/50 mt-6 font-medium">
          Protected by Firebase Authentication and SSL Encryption
        </p>
      </div>
    </div>
  );
}
