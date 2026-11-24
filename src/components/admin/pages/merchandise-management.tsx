"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Upload,
  X,
  ImageIcon,
  ShoppingBag,
  Plus,
  MessageCircle,
  Tag,
  Search,
} from "lucide-react";
import imageCompression from "browser-image-compression";
import { Skeleton } from "@/components/ui/skeleton";

interface Merchandise {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  whatsappNumber?: string;
}

export default function MerchandiseManagement() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    whatsappNumber: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchMerchandise();
  }, []);

  const fetchMerchandise = async () => {
    try {
      const response = await fetch("/api/merchandise");
      if (response.ok) {
        const data = await response.json();
        setMerchandise(data);
      }
    } catch (error) {
      console.error("Failed to fetch merchandise:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      initialQuality: 0.75,
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
      let finalImage = formData.image;

      if (selectedFile) {
        setIsProcessing(true);
        finalImage = await processImageToBase64(selectedFile);
        setIsProcessing(false);
      }

      const payload = {
        ...formData,
        image: finalImage,
      };

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/merchandise/${editingId}` : "/api/merchandise";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchMerchandise();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save merchandise:", error);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      image: "",
      whatsappNumber: "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item: Merchandise) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image || "",
      whatsappNumber: item.whatsappNumber || "",
    });
    setPreviewUrl(item.image || null);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this merchandise item?")) return;
    try {
      const response = await fetch(`/api/merchandise/${id}`, { method: "DELETE" });
      if (response.ok) await fetchMerchandise();
    } catch (error) {
      console.error("Failed to delete merchandise:", error);
    }
  };

  const filteredMerchandise = merchandise.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#163967] tracking-tight">
            Merchandise Catalog
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage official ALSA merchandise products, pricing, and WhatsApp order routing.
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
              <Plus size={16} /> Add Product
            </>
          )}
        </button>
      </div>

      {/* Form Drawer / Card */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900">
              {editingId ? "Edit Product Details" : "Add New Merchandise Item"}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {editingId ? "Update Item" : "New Inventory"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview & Upload Zone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Product Photo
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50/50 rounded-2xl border border-slate-200">
                <div className="w-32 h-32 rounded-xl bg-white border border-slate-200 overflow-hidden relative flex items-center justify-center shrink-0 shadow-sm">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setFormData({ ...formData, image: "" });
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
                    Upload image from device
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
                    Images are compressed automatically and stored safely. Recommended ratio 1:1 or 4:5.
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ALSA Official Varsity Jacket 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Price (IDR / Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="150000"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  WhatsApp Contact for Orders
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                  <input
                    type="text"
                    placeholder="6281234567890"
                    value={formData.whatsappNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, whatsappNumber: value });
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#163967] focus:ring-4 focus:ring-[#163967]/10 text-sm"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Format: 628xxxxx (numeric only). Orders click directly to this WhatsApp number.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Product Description & Sizing *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail materials, available sizes (S, M, L, XL), colorways, and pre-order dates..."
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
                  "Update Product"
                ) : (
                  "Save Product"
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
            placeholder="Search merchandise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#163967] focus:ring-2 focus:ring-[#163967]/10"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Total items: {merchandise.length}
        </span>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-3.5 w-full rounded-md" />
                  <Skeleton className="h-3.5 w-2/3 rounded-md" />
                  <Skeleton className="h-6 w-28 rounded-lg" />
                </div>
              </div>
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <Skeleton className="h-3 w-16 rounded-md" />
                <div className="flex items-center gap-1">
                  <Skeleton className="w-6 h-6 rounded-lg" />
                  <Skeleton className="w-6 h-6 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMerchandise.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-800 text-base">No merchandise found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "No merchandise matched your search query."
              : "Add official ALSA merchandise to showcase in the public catalog."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMerchandise.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="h-48 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <ShoppingBag size={36} />
                      <span className="text-xs font-medium mt-1">No Image Stored</span>
                    </div>
                  )}

                  {/* Price Tag badge */}
                  <div className="absolute top-3 left-3 bg-[#163967] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    Rp {item.price.toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-1.5 group-hover:text-[#163967] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  {item.whatsappNumber && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
                      <MessageCircle size={13} />
                      <span>WA: {item.whatsappNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">ID: {item.id.slice(0, 6)}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit item"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete item"
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
