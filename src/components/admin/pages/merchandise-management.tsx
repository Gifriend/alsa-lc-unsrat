"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Trash2, Edit2, Upload, X, ImageIcon, ShoppingBag } from "lucide-react"; // Import Icons
import imageCompression from "browser-image-compression";

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
      let finalImage = formData.image;

      if (selectedFile) {
        setIsProcessing(true);
        finalImage = await processImageToBase64(selectedFile);
        setIsProcessing(false);
      }

      const payload = { ...formData, image: finalImage };
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/merchandise/${editingId}`
        : "/api/merchandise";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchMerchandise();
        resetForm();
      } else {
        alert("Gagal menyimpan. Ukuran data mungkin terlalu besar.");
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: 0, image: "", whatsappNumber: "" });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item: Merchandise) => {
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
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/merchandise/${id}`, {
        method: "DELETE",
      });
      if (response.ok) await fetchMerchandise();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Merchandise</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        >
          {showForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Gambar */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Product Image
              </label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden relative">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setFormData({ ...formData, image: "" });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon size={24} />
                      <span className="text-[10px] mt-1">No Image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary/10 file:text-primary
                      hover:file:bg-primary/20"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Gambar akan dikompresi otomatis.
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs Lainnya */}
            <div>
              <label className="block text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Price (Rp)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: Number.parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                WhatsApp Number
              </label>
              <input
                type="text"
                placeholder="628123456789"
                value={formData.whatsappNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Hanya angka
                  setFormData({ ...formData, whatsappNumber: value });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: 628xxxxx (tanpa + atau spasi). Optional.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || isProcessing}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? (
                <Upload className="animate-pulse" size={18} />
              ) : null}
              {isProcessing
                ? "Processing..."
                : isLoading
                ? "Saving..."
                : "Save Item"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : merchandise.length === 0 ? (
        <div className="text-center py-12 bg-white rounded text-neutral-medium border border-gray-100">
          No merchandise added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {merchandise.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded shadow-sm border border-gray-100 flex justify-between items-start gap-4"
            >
              {/* Thumbnail List (Pengganti Emoji) */}
              <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingBag size={20} className="text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {item.description}
                </p>
                <p className="text-accent font-bold mt-1">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-accent hover:bg-accent/10 rounded transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
