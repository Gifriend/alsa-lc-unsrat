"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Plus,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  X,
  Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Proker {
  id: string;
  title: string;
  description: string;
  status: "ongoing" | "archived";
  startDate: string;
  division?: string;
}

const DIVISIONS = [
  { id: "all", label: "All Divisions" },
  { id: "internal", label: "Internal" },
  { id: "external", label: "External" },
  { id: "finance", label: "Finance" },
  { id: "aat", label: "Academic & Activities Training" },
  { id: "ict", label: "Information & Communication Technology" },
];

const DIVISION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  internal: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  external: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  finance: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  aat: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  ict: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
};

export default function ProkerManagement() {
  const [prokers, setProkers] = useState<Proker[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDivision, setActiveDivision] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "archived">("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    division: "internal",
    status: "ongoing" as "ongoing" | "archived",
    startDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchProker();
  }, []);

  const fetchProker = async () => {
    try {
      const response = await fetch("/api/proker");
      if (response.ok) {
        const data = await response.json();
        setProkers(data);
      }
    } catch (error) {
      console.error("Failed to fetch proker:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/proker/${editingId}` : "/api/proker";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProker();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save proker:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      division: "internal",
      status: "ongoing",
      startDate: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (proker: Proker) => {
    setFormData({
      title: proker.title,
      description: proker.description,
      division: proker.division || "internal",
      status: proker.status,
      startDate: proker.startDate ? proker.startDate.split("T")[0] : new Date().toISOString().split("T")[0],
    });
    setEditingId(proker.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work program?")) return;
    try {
      const response = await fetch(`/api/proker/${id}`, { method: "DELETE" });
      if (response.ok) await fetchProker();
    } catch (error) {
      console.error("Failed to delete proker:", error);
    }
  };

  const filteredProkers = prokers.filter((p) => {
    const matchesDivision =
      activeDivision === "all" ||
      (p.division && p.division.toLowerCase() === activeDivision.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDivision && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#163967] tracking-tight">
            Work Programs (Proker)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage ALSA LC Unsrat work programs across 5 board affairs & divisions.
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
            showForm
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
              : "bg-[#163967] hover:bg-[#112d52] text-white shadow-[#163967]/10"
          }`}
        >
          {showForm ? (
            <>
              <X size={16} /> Cancel
            </>
          ) : (
            <>
              <Plus size={16} /> Add Program
            </>
          )}
        </button>
      </div>

      {/* Form Drawer / Card */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md transition-all">
          <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900">
              {editingId ? "Edit Work Program" : "Add New Work Program"}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {editingId ? "Update Mode" : "Creation Mode"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ALSA Legal Workshop 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Division / Affair *
                </label>
                <select
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 transition-all text-sm"
                >
                  <option value="internal">Internal Affairs</option>
                  <option value="external">External Affairs</option>
                  <option value="finance">Finance Division</option>
                  <option value="aat">Academic & Activities Training (AAT)</option>
                  <option value="ict">Information & Communication Technology (ICT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Execution Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 transition-all text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Execution Status *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "ongoing" })}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      formData.status === "ongoing"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Clock size={16} /> Ongoing / Upcoming
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "archived" })}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      formData.status === "archived"
                        ? "bg-slate-200 border-slate-400 text-slate-800 ring-2 ring-slate-500/20"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <CheckCircle2 size={16} /> Completed / Archived
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Program Description & Objectives *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Outline the purpose, audience, and key highlights of this program..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 transition-all text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-[#163967] hover:bg-[#112d52] text-white font-medium text-sm shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? "Saving..." : editingId ? "Update Program" : "Save Program"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Division filter pill bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
          {DIVISIONS.map((div) => {
            const isActive = activeDivision === div.id;
            return (
              <button
                key={div.id}
                onClick={() => setActiveDivision(div.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-[#163967] text-white border-[#163967] shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {div.label}
              </button>
            );
          })}
        </div>

        {/* Quick Search & status filter */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Program cards list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="w-6 h-6 rounded-lg" />
                  <Skeleton className="w-6 h-6 rounded-lg" />
                </div>
              </div>
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-5/6 rounded-md" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Skeleton className="h-3.5 w-28 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProkers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-800 text-base">No work programs found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || activeDivision !== "all" || statusFilter !== "all"
              ? "No programs matched your active filters. Try resetting search or selecting All Divisions."
              : "Get started by adding your first ALSA LC Unsrat work program."}
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              Add First Program
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProkers.map((proker) => {
            const divKey = proker.division?.toLowerCase() || "internal";
            const divStyle = DIVISION_COLORS[divKey] || {
              bg: "bg-slate-100",
              text: "text-slate-700",
              border: "border-slate-200",
            };
            const isOngoing = proker.status === "ongoing";

            return (
              <div
                key={proker.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${divStyle.bg} ${divStyle.text} ${divStyle.border}`}
                      >
                        {proker.division || "Internal"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isOngoing
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isOngoing ? <Clock size={11} /> : <CheckCircle2 size={11} />}
                        {isOngoing ? "Ongoing" : "Completed"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(proker)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit program"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(proker.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete program"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-[#163967] transition-colors">
                    {proker.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                    {proker.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    <span>
                      {proker.startDate
                        ? new Date(proker.startDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Date not specified"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">ID: {proker.id.slice(0, 6)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
