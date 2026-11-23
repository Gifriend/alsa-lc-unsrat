"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Calendar, FileText, CheckCircle2 } from "lucide-react";

interface HistoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface HistoryFormData {
  year: string;
  title: string;
  description: string;
}

export default function HistoryManagement() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<HistoryFormData>({
    year: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        const data = await response.json();
        setHistoryItems(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.year || !formData.title || !formData.description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ year: "", title: "", description: "" });
        setIsAdding(false);
        fetchHistory();
      }
    } catch (error) {
      console.error("Error adding history:", error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.year || !formData.title || !formData.description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditingId(null);
        setFormData({ year: "", title: "", description: "" });
        fetchHistory();
      }
    } catch (error) {
      console.error("Error updating history:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this history item?")) return;

    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchHistory();
      }
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  const startEdit = (item: HistoryItem) => {
    setEditingId(item.id);
    setFormData({
      year: item.year,
      title: item.title,
      description: item.description,
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ year: "", title: "", description: "" });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_25px_rgba(22,57,103,0.03)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
            Heritage & Timeline
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#163967]">
            History Management
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Kelola garis waktu sejarah, tonggak pencapaian, dan arsip perjalanan ALSA LC UNSRAT.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setFormData({ year: "", title: "", description: "" });
          }}
          className="inline-flex items-center gap-2 bg-[#163967] hover:bg-[#112d52] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>{isAdding ? "Close Form" : "Add Milestone"}</span>
        </button>
      </div>

      {/* Add / Edit Form Card */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-blue-100/80 shadow-md">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <h3 className="font-serif text-lg font-bold text-[#163967] flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              <span>{editingId ? "Edit History Milestone" : "Add New Milestone"}</span>
            </h3>
            <button
              onClick={cancelEdit}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Year / Periode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="Contoh: 2024"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm text-gray-900 shadow-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/15 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Milestone Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Pembentukan Kepengurusan Pertama"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm text-gray-900 shadow-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Description & Detail <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Deskripsikan peristiwa dan dampaknya bagi organisasi..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm text-gray-900 shadow-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/15 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => (editingId ? handleUpdate(editingId) : handleAdd())}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                <Save size={15} />
                <span>{editingId ? "Update Milestone" : "Save Milestone"}</span>
              </button>

              <button
                onClick={cancelEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <X size={15} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Items List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(22,57,103,0.03)] p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
          <h3 className="font-serif text-lg font-bold text-[#163967]">
            Daftar Timeline Milestones
          </h3>
          <span className="text-xs text-gray-500 font-semibold bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            {historyItems.length} Milestones Recorded
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading history data...</div>
        ) : historyItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-40 text-blue-400" />
            <p className="font-medium text-sm">Belum ada data sejarah.</p>
            <p className="text-xs text-gray-400 mt-1">
              Klik &quot;Add Milestone&quot; untuk menambahkan tonggak sejarah baru.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {historyItems.map((item, index) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-gray-100 bg-[#fbfdff] hover:bg-white hover:border-blue-100 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Stepper with Numbering */}
                  <div className="w-10 h-10 rounded-full bg-[#163967] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border-2 border-white">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#163967] text-[11px] font-bold">
                        {item.year}
                      </span>
                      <h4 className="font-serif text-base font-bold text-gray-900 truncate">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}