"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Trash2, Edit2, Upload, X } from "lucide-react"
import Image from "next/image"

interface BODMember {
  id: string
  name: string
  position: string
  image?: string
  level: number
  order: number
}

const LEVEL_OPTIONS = [
  { value: 1, label: "Level 1 - Top (President/Chairman)" },
  { value: 2, label: "Level 2 - Council/Supervisors" },
  { value: 3, label: "Level 3 - Secretary General" },
  { value: 4, label: "Level 4 - Vice Presidents" },
  { value: 5, label: "Level 5 - Chief Officers" },
]

export default function BODManagement() {
  const [members, setMembers] = useState<BODMember[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    image: "",
    level: 1,
    order: 0,
  })

  useEffect(() => {
    fetchBOD()
  }, [])

  const fetchBOD = async () => {
    try {
      const response = await fetch("/api/bod")
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error("Failed to fetch BOD:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const img = new window.Image();
  const reader = new FileReader();

  reader.onload = (readerEvent) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 600; // resolusi maksimum
      const scaleSize = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // kompres kualitas 0.7 (70%)
      const compressed = canvas.toDataURL("image/jpeg", 0.7);

      setFormData((prev) => ({ ...prev, image: compressed }));
    };

    img.src = readerEvent.target?.result as string;
  };

  reader.readAsDataURL(file);
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/bod/${editingId}` : "/api/bod"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchBOD()
        setFormData({ name: "", position: "", image: "", level: 1, order: 0 })
        setShowForm(false)
        setEditingId(null)
      }
    } catch (error) {
      console.error("Failed to save BOD member:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (member: BODMember) => {
    setFormData({
      name: member.name,
      position: member.position,
      image: member.image || "",
      level: member.level || 1,
      order: member.order || 0,
    })
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/bod/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchBOD()
      }
    } catch (error) {
      console.error("Failed to delete BOD member:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Manage Board of Directors</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({ name: "", position: "", image: "", level: 1, order: 0 })
            }
          }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "Add Member"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-bold mb-2">Photo</label>
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                      <Image
                        src={formData.image || "/placeholder.svg"}
                        alt="Preview"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-ring rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Position</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border border-ring rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Level (Hierarchy)</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-ring rounded"
                >
                  {LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Order (Position in Level)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-ring rounded"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
              {isLoading ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 bg-white rounded text-neutral-medium">No BOD members added yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left">Photo</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left">Level</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b hover:bg-neutral-light">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {member.image ? (
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">?</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{member.name}</td>
                  <td className="px-4 py-3">{member.position}</td>
                  <td className="px-4 py-3">Level {member.level || 1}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-2 text-accent hover:bg-neutral-light rounded"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
