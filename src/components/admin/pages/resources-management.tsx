"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  FileText,
  X,
  Image as ImageIcon,
  Archive,
  File,
  Plus,
  Upload,
  Download,
  FolderOpen,
  Search,
  Check,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

interface ResourceFile {
  id: string;
  resource_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

interface Resource {
  id: string;
  name: string;
  description: string;
  file_type: string | null;
  file_url: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  resource_files: ResourceFile[];
}

const CATEGORIES = [
  { id: "all", label: "All Documents" },
  { id: "official", label: "Statutes & Official (GBHK, AD/ART, SOP)" },
  { id: "academic", label: "Academic & Legal Guides" },
  { id: "other", label: "General Resources" },
];

export default function ResourcesManagement() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "official",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [keepFileIds, setKeepFileIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/resources");
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeNewFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleKeepFile = (fileId: string) => {
    setKeepFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);

      files.forEach((file) => {
        data.append("files", file);
      });

      if (editingId) {
        keepFileIds.forEach((id) => {
          data.append("keepFileIds", id);
        });

        const response = await fetch(`/api/resources/${editingId}`, {
          method: "PUT",
          body: data,
        });

        if (response.ok) {
          setStatusMessage({ type: "success", text: "Resource updated successfully" });
          await fetchResources();
          resetForm();
        } else {
          const err = await response.json();
          setStatusMessage({ type: "error", text: err.message || "Failed to update resource" });
        }
      } else {
        if (files.length === 0) {
          alert("Please upload at least one PDF or document file.");
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/resources", {
          method: "POST",
          body: data,
        });

        if (response.ok) {
          setStatusMessage({ type: "success", text: "Resource published successfully" });
          await fetchResources();
          resetForm();
        } else {
          const err = await response.json();
          setStatusMessage({ type: "error", text: err.message || "Failed to create resource" });
        }
      }
    } catch (error) {
      console.error("Failed to save resource:", error);
      setStatusMessage({ type: "error", text: "Network error saving resource" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", category: "official" });
    setFiles([]);
    setKeepFileIds([]);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (resource: Resource) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFormData({
      name: resource.name,
      description: resource.description,
      category: resource.category || "official",
    });
    setKeepFileIds(resource.resource_files?.map((f) => f.id) || []);
    setFiles([]);
    setEditingId(resource.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource and all attached files?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      if (response.ok) {
        setStatusMessage({ type: "success", text: "Resource removed successfully" });
        await fetchResources();
      } else {
        const err = await response.json();
        alert(`Failed to delete: ${err.message}`);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "webp"].includes(type)) {
      return <ImageIcon size={18} className="text-purple-600" />;
    }
    if (["zip", "rar", "7z"].includes(type)) {
      return <Archive size={18} className="text-amber-600" />;
    }
    if (["pdf"].includes(type)) {
      return <FileText size={18} className="text-rose-600" />;
    }
    return <File size={18} className="text-blue-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const editingResource = resources.find((r) => r.id === editingId);

  const filteredResources = resources.filter((res) => {
    const matchesCategory =
      activeCategory === "all" ||
      (res.category && res.category.toLowerCase() === activeCategory.toLowerCase());
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#163967] tracking-tight">
            Legal Resources & Statutes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage AD/ART, GBHK, SOP, and organizational guidelines for member download.
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
              <Plus size={16} /> Upload Resource
            </>
          )}
        </button>
      </div>

      {/* Upload/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900">
              {editingId ? "Edit Resource Information" : "Upload New Resource File"}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {editingId ? "Update Mode" : "New Document"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard Operating Procedure (SOP) ALSA LC Unsrat 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Classification Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                >
                  <option value="official">Official Statutes (GBHK / AD-ART / SOP)</option>
                  <option value="academic">Academic & Legal Guides</option>
                  <option value="other">General Content / Forms</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Summary & Context *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide a brief explanation of what this legal statute or guide contains..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                />
              </div>
            </div>

            {/* Existing Files if Editing */}
            {editingId && editingResource?.resource_files && editingResource.resource_files.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Current Files in Database ({editingResource.resource_files.length})
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {editingResource.resource_files.map((file) => {
                    const isKept = keepFileIds.includes(file.id);
                    return (
                      <div
                        key={file.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          isKept
                            ? "bg-slate-50 border-slate-200"
                            : "bg-rose-50/60 border-rose-200 line-through text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {getFileIcon(file.file_type)}
                          <div className="truncate">
                            <p className="text-sm font-semibold truncate text-slate-800">
                              {file.file_name}
                            </p>
                            <span className="text-xs text-slate-500 uppercase">{file.file_type}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleKeepFile(file.id)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                            isKept
                              ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                              : "bg-rose-100 text-rose-700 border-rose-300 hover:bg-rose-200"
                          }`}
                        >
                          {isKept ? "Keep File" : "Marked for Delete"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* File Upload Drop Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Attach Files (PDF, DOCX, ZIP)
              </label>
              <label className="border-2 border-dashed border-slate-200 hover:border-[#163967] rounded-2xl p-6 bg-slate-50/50 hover:bg-white flex flex-col items-center justify-center cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm font-semibold text-slate-700">
                  Click to browse files or drag and drop here
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supports PDF documents, Word archives, and presentation packages.
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Staged new files */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Ready to Upload ({files.length}):
                  </span>
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText size={16} className="text-[#163967]" />
                        <span className="font-semibold text-slate-800 truncate">{file.name}</span>
                        <span className="text-slate-500">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                {isLoading ? "Saving..." : editingId ? "Update Document" : "Publish Document"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-[#163967] text-white border-[#163967] shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/10"
          />
        </div>
      </div>

      {/* Resources Cards */}
      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-8 h-8 border-3 border-[#163967] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading resources catalog...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-800 text-base">No resources found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || activeCategory !== "all"
              ? "No files matched your filter query. Try selecting 'All Documents' or adjusting search terms."
              : "Upload ALSA LC Unsrat statutes (GBHK, AD/ART, SOP) to make them accessible."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => {
            const isOfficial = resource.category === "official";
            const filesCount = resource.resource_files?.length || 0;

            return (
              <div
                key={resource.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isOfficial ? "bg-blue-50 text-[#163967]" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isOfficial ? <ShieldCheck size={24} /> : <FileText size={24} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                          isOfficial
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {resource.category || "Official Document"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {filesCount} {filesCount === 1 ? "file" : "files"} attached
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#163967] transition-colors truncate">
                      {resource.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                      {resource.description}
                    </p>

                    {/* File Pills */}
                    {resource.resource_files && resource.resource_files.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {resource.resource_files.map((f) => (
                          <a
                            key={f.id}
                            href={f.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            {getFileIcon(f.file_type)}
                            <span className="truncate max-w-[150px]">{f.file_name}</span>
                            <Download size={12} className="text-slate-400 ml-0.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                  <button
                    onClick={() => handleEdit(resource)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit document"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete document"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
