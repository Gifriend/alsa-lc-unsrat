"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Upload,
  X,
  Trophy,
  Calendar,
  Plus,
  ImageIcon,
  Search,
  Award,
} from "lucide-react";
import imageCompression from "browser-image-compression";

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  category?: string;
}

export default function AchievementsManagement() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    imageUrl: "",
    category: "Competition",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/achievements");
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedFile(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const processImageToBase64 = async (file: File): Promise<string> => {
    const options = {
      maxSizeMB: 0.15,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      initialQuality: 0.7,
      fileType: "image/jpeg",
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const base64String = await fileToBase64(compressedFile);
      return base64String;
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      if (selectedFile) {
        setIsProcessing(true);
        finalImageUrl = await processImageToBase64(selectedFile);
        setIsProcessing(false);
      }

      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
      };

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/achievements/${editingId}` : "/api/achievements";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchAchievements();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save achievement:", error);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      imageUrl: "",
      category: "Competition",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (achievement: Achievement) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFormData({
      title: achievement.title,
      description: achievement.description,
      date: achievement.date ? achievement.date.split("T")[0] : new Date().toISOString().split("T")[0],
      imageUrl: achievement.imageUrl || "",
      category: achievement.category || "Competition",
    });
    setPreviewUrl(achievement.imageUrl || null);
    setEditingId(achievement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      const response = await fetch(`/api/achievements/${id}`, { method: "DELETE" });
      if (response.ok) await fetchAchievements();
    } catch (error) {
      console.error("Failed to delete achievement:", error);
    }
  };

  const filteredAchievements = achievements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#163967] tracking-tight">
            Awards & Achievements
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Showcase trophies, national moot court medals, and institutional milestones.
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
              <Plus size={16} /> Add Achievement
            </>
          )}
        </button>
      </div>

      {/* Form Drawer / Card */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900">
              {editingId ? "Edit Achievement Record" : "Add New Achievement Record"}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {editingId ? "Update Record" : "New Award"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview & Upload Zone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Award / Podium Photo
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50/50 rounded-2xl border border-slate-200">
                <div className="w-32 h-32 rounded-xl bg-white border border-slate-200 overflow-hidden relative flex items-center justify-center shrink-0 shadow-sm">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Achievement preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setFormData({ ...formData, imageUrl: "" });
                        }}
                        className="absolute top-1.5 right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow"
                      >
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <ImageIcon size={28} />
                      <span className="text-[10px] font-medium mt-1">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload trophy or team photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-xs text-slate-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-semibold
                      file:bg-[#163967]/10 file:text-[#163967]
                      hover:file:bg-[#163967]/20 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-2">
                    Photos are compressed to lightweight Base64 and stored directly in database.
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Place National Moot Court Competition (NMCC)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Award Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                >
                  <option value="Competition">National Moot Court Competition</option>
                  <option value="Debate">Legal Debate Championship</option>
                  <option value="Essay">Scientific Legal Paper / Essay</option>
                  <option value="Institutional">National Chapter Award</option>
                  <option value="Other">Other Recognition</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Date Received *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Achievement Details & Delegation Members *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Specify the host institution, delegation team members, and competitive highlights..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
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
                disabled={isLoading || isProcessing}
                className="px-6 py-2.5 rounded-xl bg-[#163967] hover:bg-[#112d52] text-white font-medium text-sm shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Upload className="animate-spin" size={16} /> Compressing...
                  </>
                ) : isLoading ? (
                  "Saving..."
                ) : editingId ? (
                  "Update Record"
                ) : (
                  "Save Achievement"
                )}
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
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/10"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Total awards: {achievements.length}
        </span>
      </div>

      {/* Achievements Cards */}
      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-8 h-8 border-3 border-[#163967] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading achievements records...</p>
        </div>
      ) : filteredAchievements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-800 text-base">No achievements found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "No achievements matched your search terms."
              : "Publish ALSA LC Unsrat delegations awards and competition victories."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAchievements.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Trophy size={36} />
                      <span className="text-xs font-medium mt-1">Medal / Trophy</span>
                    </div>
                  )}

                  {/* Award badge */}
                  <div className="absolute top-3 left-3 bg-[#163967]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                    <Award size={13} className="text-amber-300" />
                    <span>{item.category || "Honorable Award"}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-1.5 group-hover:text-[#163967] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar size={13} className="text-slate-400" />
                  <span>
                    {item.date
                      ? new Date(item.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Date not specified"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit record"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
