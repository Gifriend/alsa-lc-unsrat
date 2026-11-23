"use client";

import { Menu, LogOut, User, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  onMenuClick: () => void;
  currentPageTitle?: string;
}

export default function AdminHeader({
  onMenuClick,
  currentPageTitle,
}: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/auth/login");
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <span>Admin Portal</span>
              <span>/</span>
              <span className="text-[#163967] font-bold">
                {currentPageTitle || "Management"}
              </span>
            </div>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#163967] leading-tight">
              Dashboard Overview
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Database Synced</span>
          </div>

          {/* Admin Identity */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-semibold">
            <div className="w-5 h-5 rounded-full bg-[#163967] text-white flex items-center justify-center">
              <ShieldCheck size={12} />
            </div>
            <span>Administrator</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
