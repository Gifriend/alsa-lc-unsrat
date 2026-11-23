"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  BookOpen,
  Plus,
  FileText,
  Download,
  Search,
  X,
  Calendar,
  User,
} from "lucide-react";

interface Publication {
  id: string;
  title: string;
  authors: string;
  year: number;
  pdf_url?: string;
}

export default function PublicationsManagement() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    year: new Date().getFullYear(),
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch("/api/publications");
      if (response.ok) {
        const data = await response.json();
        setPublications(data);
      }
    } catch (error) {
      console.error("Failed to fetch publications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/publications/${editingId}` : "/api/publications";

      const data = new FormData();
      data.append("title", formData.title);
      data.append("authors", formData.authors);
      data.append("year", formData.year.toString());
      if (file) {
        data.append("pdf", file);
      }

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        await fetchPublications();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save publication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", authors: "", year: new Date().getFullYear() });
    setFile(null);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (pub: Publication) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFormData({
      title: pub.title,
      authors: pub.authors,
      year: pub.year,
    });
    setEditingId(pub.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;
    try {
      const response = await fetch(`/api/publications/${id}`, { method: "DELETE" });
      if (response.ok) await fetchPublications();
    } catch (error) {
      console.error("Failed to delete publication:", error);
    }
  };

  const filteredPublications = publications.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#163967] tracking-tight">
            Academic Publications & Journals
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage legal journals, law review editions, and academic essays written by members.
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
              <Plus size={16} /> Add Publication
            </>
          )}
        </button>
      </div>

      {/* Form Drawer / Card */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900">
              {editingId ? "Edit Publication Details" : "Publish New Academic Paper"}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {editingId ? "Update Paper" : "New Edition"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Paper / Journal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Analysis of International Maritime Law and Sustainable Fisheries in Indonesia"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Author(s) *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe, S.H., & ALSA Editorial Board"
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Publication Year *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="number"
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: Number.parseInt(e.target.value) || new Date().getFullYear(),
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Attach Manuscript (PDF File)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-xl file:border-0
                    file:text-xs file:font-semibold
                    file:bg-[#163967]/10 file:text-[#163967]
                    hover:file:bg-[#163967]/20 file:cursor-pointer cursor-pointer border border-slate-200 rounded-xl p-2 bg-slate-50/50"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Leave empty if you only want to update publication metadata.
                </p>
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
                {isLoading ? "Saving..." : editingId ? "Update Publication" : "Publish Paper"}
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
            placeholder="Search papers or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/10"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Total publications: {publications.length}
        </span>
      </div>

      {/* Publications Cards */}
      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-8 h-8 border-3 border-[#163967] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading publications catalog...</p>
        </div>
      ) : filteredPublications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-800 text-base">No publications found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "No papers matched your search query."
              : "Upload ALSA LC Unsrat legal publications, journals, and essays."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPublications.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#163967] flex items-center justify-center shrink-0">
                  <FileText size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.year}
                    </span>
                    <span className="text-xs text-slate-400">by {item.authors}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#163967] transition-colors truncate">
                    {item.title}
                  </h3>

                  {item.pdf_url && (
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 mt-2"
                    >
                      <Download size={13} /> View Attached Manuscript (PDF)
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  title="Edit publication"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete publication"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
