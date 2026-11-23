"use client";

import Image from "next/image";
import Link from "next/link";
import {
  X,
  History,
  Shield,
  Briefcase,
  FileText,
  BookOpen,
  ShoppingBag,
  Award,
  Users,
  UserCheck,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react";

export type PageType =
  | "history"
  | "bod"
  | "proker"
  | "resources"
  | "publications"
  | "merchandise"
  | "achievements"
  | "members"
  | "founders";

interface AdminSidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  currentPage,
  onPageChange,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const menuItems: Array<{
    label: string;
    page: PageType;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    category?: string;
  }> = [
    { label: "History & Timeline", page: "history", icon: History, category: "Content & Heritage" },
    { label: "Board & Kepengurusan", page: "bod", icon: Shield, category: "Content & Heritage" },
    { label: "Work Programs (Proker)", page: "proker", icon: Briefcase, category: "Activities & Media" },
    { label: "Legal Resources (GBHK/SOP)", page: "resources", icon: FileText, category: "Activities & Media" },
    { label: "Publications & Articles", page: "publications", icon: BookOpen, category: "Activities & Media" },
    { label: "Merchandise & Orders", page: "merchandise", icon: ShoppingBag, category: "Activities & Media" },
    { label: "Achievements", page: "achievements", icon: Award, category: "Community & Network" },
    { label: "Members & Alumni Stats", page: "members", icon: Users, category: "Community & Network" },
    { label: "Founding Fathers", page: "founders", icon: UserCheck, category: "Community & Network" },
  ];

  const handleClick = (page: PageType) => {
    onPageChange(page);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs md:hidden z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Modern Sidebar Container */}
      <aside
        className={`
        fixed left-0 top-0 z-40
        h-screen w-64 md:w-72
        bg-gradient-to-b from-[#0a1b33] via-[#0d223f] to-[#0a182d] text-white shadow-2xl border-r border-white/10
        flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/ALSA-logo-putih.png"
                  alt="ALSA LC UNSRAT"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="font-serif text-base font-bold text-white tracking-wide leading-tight">
                  ALSA LC UNSRAT
                </h2>
                <span className="text-[10px] text-blue-300 font-medium uppercase tracking-wider block">
                  Admin Workspace
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="md:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)]">
            <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-blue-300/60">
              Navigation Menu
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;

              return (
                <button
                  key={item.page}
                  onClick={() => handleClick(item.page)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? "bg-[#163967] text-white shadow-md border-l-4 border-blue-400 pl-3 font-bold"
                      : "text-blue-100/75 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon
                    size={17}
                    className={`shrink-0 ${
                      isActive ? "text-blue-300" : "text-blue-200/60"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-[#071324]/80">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-blue-200 hover:text-white text-xs font-semibold transition-all group"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard size={15} />
              <span>View Live Website</span>
            </div>
            <ExternalLink
              size={13}
              className="text-blue-300/60 group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </aside>
    </>
  );
}
