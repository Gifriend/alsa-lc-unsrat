"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Trash2, Edit2, Upload, X, Shield, Plus, Save, User, Calendar } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface BODMember {
  id: string;
  name: string;
  position: string;
  image?: string;
  level: number;
  order: number;
}

const LEVEL_OPTIONS = [
  { value: 1, label: "Level 1 - Director" },
  { value: 2, label: "Level 2 - Advisors/Supervisors" },
  { value: 3, label: "Level 3 - Secretary General" },
  { value: 4, label: "Level 4 - Vice Director" },
  { value: 5, label: "Level 5 - Manager / Officers" },
];

export default function BODManagement() {
  const [members, setMembers] = useState<BODMember[]>([]);
  const [term, setTerm] = useState("2025-2026");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    image: "",
    level: 1,
    order: 0,
  });

  useEffect(() => {
    fetchBOD();
  }, []);

  const fetchBOD = async () => {
    try {
      const response = await fetch("/api/bod");
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
        setTerm(data.term || "2025-2026");
      }
    } catch (error) {
      console.error("Failed to fetch BOD:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new window.Image();
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        setFormData((prev) => ({ ...prev, image: compressed }));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/bod/${editingId}` : "/api/bod";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchBOD();
        setFormData({ name: "", position: "", image: "", level: 1, order: 0 });
        setShowForm(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error("Failed to save BOD member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTerm = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bod-term", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term }),
      });

      if (response.ok) {
        await fetchBOD();
        alert("Periode kepengurusan berhasil diperbarui!");
      }
    } catch (error) {
      console.error("Failed to update term:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member: BODMember) => {
    setFormData({
      name: member.name,
      position: member.position,
      image: member.image || "",
      level: member.level || 1,
      order: member.order || 0,
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this BOD member?")) return;

    try {
      const response = await fetch(`/api/bod/${id}`, { method: "DELETE" });
      if (response.ok) {
        await fetchBOD();
      }
    } catch (error) {
      console.error("Failed to delete BOD member:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_25px_rgba(22,57,103,0.03)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
            Leadership & Structure
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#163967]">
            Board of Directors (BOD)
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Kelola data direktur, wakil direktur, jajaran pengurus harian, dan periode kepengurusan.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", position: "", image: "", level: 1, order: 0 });
          }}
          className="inline-flex items-center gap-2 bg-[#163967] hover:bg-[#112d52] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>{showForm ? "Close Form" : "Add BOD Member"}</span>
        </button>
      </div>

      {/* Term Configuration Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#163967] flex items-center justify-center shrink-0">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#163967]">Active Leadership Term</h4>
            <p className="text-xs text-gray-500">
              Periode kepengurusan yang ditampilkan pada website publik.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Contoh: 2025-2026"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#163967] shadow-xs focus:outline-none focus:border-[#163967] w-full sm:w-44"
          />
          <button
            onClick={handleUpdateTerm}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-[#163967] hover:bg-[#112d52] text-white text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            Update Term
          </button>
        </div>
      </div>

      {/* Add / Edit Member Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-blue-100/80 shadow-md">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <h3 className="font-serif text-lg font-bold text-[#163967] flex items-center gap-2">
              <Shield size={18} className="text-blue-600" />
              <span>{editingId ? "Edit BOD Member" : "Add New BOD Member"}</span>
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Photo Upload with Preview */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Member Portrait
              </label>
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#163967] shadow-sm group">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 hover:border-[#163967] flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-colors">
                    <Upload size={18} className="text-gray-400" />
                    <span className="text-[10px] text-gray-500 font-semibold mt-1">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-gray-400 max-w-xs">
                  Foto format JPG/PNG rasio 1:1. Jika dikosongkan, avatar placeholder otomatis digunakan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Nathania E. Kembuan"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm text-gray-900 shadow-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Position / Jabatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Contoh: Director of ALSA LC Unsrat"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm text-gray-900 shadow-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/15 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Level Hierarchy <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm text-gray-900 shadow-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/15 transition-all"
                >
                  {LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Urutan dalam Level (Order)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm text-gray-900 shadow-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/15 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Save size={15} />
                <span>{editingId ? "Update Member" : "Save Member"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <X size={15} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(22,57,103,0.03)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#163967]">
            Daftar Anggota BOD & Pengurus
          </h3>
          <span className="text-xs text-gray-500 font-semibold bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            {members.length} Officers
          </span>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-36 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <User size={40} className="mx-auto mb-3 opacity-40 text-blue-400" />
            <p className="font-medium text-sm">Belum ada pengurus terdaftar.</p>
            <p className="text-xs text-gray-400 mt-1">
              Klik &quot;Add BOD Member&quot; untuk menambahkan jajaran kepengurusan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Photo</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Position</th>
                  <th className="px-6 py-3.5">Level</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-slate-100">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-gray-900">{member.name}</td>
                    <td className="px-6 py-3.5 text-gray-600">{member.position}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#163967] text-[11px] font-bold">
                        Level {member.level}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}