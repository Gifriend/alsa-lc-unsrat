"use client";

import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  Award,
  Save,
  CheckCircle2,
  TrendingUp,
  Info,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MemberStats {
  activeMembers: number;
  alumni: number;
  totalMembers: number;
}

export default function MembersManagement() {
  const [stats, setStats] = useState<MemberStats>({
    activeMembers: 0,
    alumni: 0,
    totalMembers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/member-stats");
      if (response.ok) {
        const data = await response.json();
        setStats({
          activeMembers: data.activeMembers || 0,
          alumni: data.alumni || 0,
          totalMembers: (data.activeMembers || 0) + (data.alumni || 0),
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setMessage({ type: "error", text: "Failed to load member statistics" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch("/api/member-stats", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          activeMembers: stats.activeMembers,
          alumni: stats.alumni,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Statistics successfully updated and published to landing page" });
        await fetchStats();
      } else {
        setMessage({ type: "error", text: "Failed to save statistics" });
      }
    } catch (error) {
      console.error("Failed to save stats:", error);
      setMessage({ type: "error", text: "An error occurred while saving statistics" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const calculatedTotal = stats.activeMembers + stats.alumni;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <Skeleton className="h-6 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="w-10 h-10 rounded-xl" />
              </div>
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-3.5 w-44 rounded-md" />
            </div>
          ))}
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="space-y-2 pb-4 border-b border-slate-100">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-3.5 w-72 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-xl font-bold text-[#163967] tracking-tight">
          Member & Alumni Demographics
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure official public statistics shown on the homepage and membership cards.
        </p>
      </div>

      {/* Toast Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className={message.type === "success" ? "text-emerald-600" : "text-rose-600"} />
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Highlight Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Active Members Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Members
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#163967] tracking-tight">
              {stats.activeMembers.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500 mt-1">Undergraduate law students enrolled</p>
          </div>
        </div>

        {/* Alumni Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Alumni Network
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#163967] tracking-tight">
              {stats.alumni.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500 mt-1">Graduated legal practitioners & advocates</p>
          </div>
        </div>

        {/* Total Members Card */}
        <div className="bg-gradient-to-br from-[#163967] to-[#0c2242] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Total Community Reach
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center backdrop-blur-sm">
              <TrendingUp size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {calculatedTotal.toLocaleString("id-ID")}+
            </div>
            <p className="text-xs text-blue-200 mt-1">Combined active roster & alumni registry</p>
          </div>
        </div>
      </div>

      {/* Edit Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="font-semibold text-lg text-slate-900">
            Update Statistics
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Modify values below. Changes instantly reflect on the landing page frosted stats bar.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Active Members Count *
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="number"
                  min="0"
                  required
                  value={stats.activeMembers}
                  onChange={(e) =>
                    setStats((prev) => ({
                      ...prev,
                      activeMembers: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Alumni Network Count *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="number"
                  min="0"
                  required
                  value={stats.alumni}
                  onChange={(e) =>
                    setStats((prev) => ({
                      ...prev,
                      alumni: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info size={14} className="text-slate-400" />
              <span>Calculated Total: <strong>{calculatedTotal}</strong></span>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#163967] hover:bg-[#112d52] text-white font-medium text-sm shadow-sm transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? "Saving Changes..." : "Publish Numbers"}
            </button>
          </div>
        </form>
      </div>

      {/* Information Banner */}
      <div className="p-5 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-start gap-3.5 text-xs text-slate-600 leading-relaxed">
        <Info className="w-5 h-5 text-[#163967] shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800 font-semibold block mb-0.5">Live Sync Notice:</strong>
          These counts are automatically synchronized with the homepage frosted glass statistics cards (&quot;Our Statistics&quot;) and the public membership directory.
        </div>
      </div>
    </div>
  );
}
