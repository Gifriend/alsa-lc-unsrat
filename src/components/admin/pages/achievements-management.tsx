"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Trash2, Edit2, Upload, X } from "lucide-react"
import imageCompression from "browser-image-compression" 
// HAPUS IMPORT FIREBASE STORAGE
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
// import { storage } from "@/lib/firebase"

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  imageUrl?: string 
}

export default function AchievementsManagement() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false) // Ganti nama jadi processing

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    imageUrl: "",
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/achievements")
      if (response.ok) {
        const data = await response.json()
        setAchievements(data)
      }
    } catch (error) {
      console.error("Failed to fetch achievements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setSelectedFile(file)
    }
  }

  // FUNGSI BARU: Konversi File ke Base64 String
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // FUNGSI BARU: Kompresi lalu ubah ke Base64 (Tanpa Upload ke Storage)
  const processImageToBase64 = async (file: File): Promise<string> => {
    console.log(`Original size: ${file.size / 1024 / 1024} MB`);

    const options = {
      // SANGAT PENTING: Target size harus kecil karena Base64 menambah ukuran file sktr 33%
      // Dan Firestore punya limit 1MB per dokumen.
      maxSizeMB: 0.15,       // Target ~150KB
      maxWidthOrHeight: 800, // Resolusi cukup segini
      useWebWorker: true,
      initialQuality: 0.6,
      fileType: "image/jpeg"
    }

    try {
      // 1. Kompresi Gambar
      const compressedFile = await imageCompression(file, options)
      console.log(`Compressed size: ${compressedFile.size / 1024 / 1024} MB`);

      // 2. Ubah ke Base64 String
      const base64String = await fileToBase64(compressedFile)
      return base64String

    } catch (error) {
      console.error("Error processing image:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let finalImageUrl = formData.imageUrl

      // Jika ada file baru, proses menjadi Base64 string
      if (selectedFile) {
        setIsProcessing(true)
        finalImageUrl = await processImageToBase64(selectedFile)
        setIsProcessing(false)
      }

      // Payload sekarang berisi string Base64 yang sangat panjang
      const payload = {
        ...formData,
        imageUrl: finalImageUrl 
      }

      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/achievements/${editingId}` : "/api/achievements"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchAchievements()
        resetForm()
      } else {
        // Handle jika payload terlalu besar (lebih dari 1MB limit Firestore/Vercel)
        alert("Gagal menyimpan. Kemungkinan gambar masih terlalu besar.")
      }
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setIsLoading(false)
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setFormData({ title: "", description: "", date: new Date().toISOString().split("T")[0], imageUrl: "" })
    setSelectedFile(null)
    setPreviewUrl(null)
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (achievement: Achievement) => {
    setFormData({
      title: achievement.title,
      description: achievement.description,
      date: achievement.date?.split("T")[0] || new Date().toISOString().split("T")[0],
      imageUrl: achievement.imageUrl || ""
    })
    // Jika imageUrl adalah Base64, browser bisa langsung menampilkannya
    setPreviewUrl(achievement.imageUrl || null)
    setEditingId(achievement.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const response = await fetch(`/api/achievements/${id}`, { method: "DELETE" })
      if (response.ok) await fetchAchievements()
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Achievements</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) resetForm()
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        >
          {showForm ? "Cancel" : "Add Achievement"}
        </button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded shadow mb-6 border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Input */}
            <div>
              <label className="block text-sm font-bold mb-2">Image (Disimpan di DB)</label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden relative">
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl(null)
                          setFormData({...formData, imageUrl: ""})
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs text-center px-2">No Image</span>
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
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Foto akan dikonversi menjadi teks Base64 dan disimpan langsung di database.
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs Lainnya */}
            <div>
              <label className="block text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded bg-background"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded bg-background"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || isProcessing}
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? <Upload className="animate-pulse" size={18}/> : null}
              {isProcessing ? "Processing Image..." : isLoading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      )}

      {/* List Display */}
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-12 bg-card rounded text-muted-foreground">No achievements added yet.</div>
      ) : (
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-card p-4 rounded shadow flex justify-between items-start gap-4">
               {/* Thumbnail Image */}
               {achievement.imageUrl && (
                <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-gray-100">
                  <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-bold">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{achievement.description}</p>
                <p className="text-xs text-accent-foreground mt-1">
                  {achievement.date ? new Date(achievement.date).toLocaleDateString() : "No date"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(achievement)}
                  className="p-2 text-muted-foreground hover:bg-muted rounded"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(achievement.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}