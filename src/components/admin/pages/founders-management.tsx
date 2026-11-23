"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Plus,
  Search,
  X,
  Crown,
  Calendar,
  Sparkles,
} from "lucide-react";

interface Founder {
  id: string;
  name: string;
  period: string;
  description: string;
}

export default function FoundersManagement() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    period: "",
    description: "",
  });

  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      const response = await fetch("/api/founders");
      if (response.ok) {
        const data = await response.json();
        setFounders(data);
      }
    } catch (error) {
      console.error("Failed to fetch founders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.period || !formData.description) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/founders/${editingId}` : "/api/founders";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchFounders();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to save founder"}`);
      }
    } catch (error) {
      console.error("Failed to save founder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", period: "", description: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (founder: Founder) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFormData({
      name: founder.name,
      period: founder.period,
      description: founder.description,
    });
    setEditingId(founder.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this founder entry?")) return;
    try {
      const response = await fetch(`/api/founders/${id}`, { method: "DELETE" });
      if (response.ok) await fetchFounders();
    } catch (error) {
      console.error("Failed to delete founder:", error);
    }
  };

  const filteredFounders = founders.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.period.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#163967] tracking-tight">
            Founding Fathers & Pioneer Leaders
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Maintain the historical record and tribute of ALSA Local Chapter Universitas Sam Ratulangi pioneers.
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
              <Plus size={16} /> Add Founder
            </>
          )}
        </button>
      </div>

      {/* Form Drawer / Card */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900">
              {editingId ? "Edit Founder Record" : "Add Founding Figure"}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {editingId ? "Update Record" : "New Entry"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Full Name with Honorifics *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adv. John Doe, S.H., M.H."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Service Period / Year of Founding *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2000 - 2002 (Pioneer Era)"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Historical Contribution & Profile *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Record their visionary initiatives, establishment milestones, and ongoing legacy..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm leading-relaxed"
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
                {isLoading ? "Saving..." : editingId ? "Update Founder" : "Save Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search founders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/10"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Total figures: {founders.length}
        </span>
      </div>

      {/* Founders Cards */}
      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-8 h-8 border-3 border-[#163967] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading founders archive...</p>
        </div>
      ) : filteredFounders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <Crown className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-800 text-base">No founders found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "No founder records match your search query."
              : "Record the founding figures who established ALSA LC Unsrat."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFounders.map((founder) => (
            <div
              key={founder.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                      <Crown size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#163967] transition-colors">
                        {founder.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mt-0.5">
                        <Calendar size={11} /> {founder.period}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(founder)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit founder"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(founder.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete founder"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed line-clamp-4 mt-2">
                  {founder.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 mt-4">
                <span>Pioneering Chapter Member</span>
                <span>ID: {founder.id.slice(0, 6)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
