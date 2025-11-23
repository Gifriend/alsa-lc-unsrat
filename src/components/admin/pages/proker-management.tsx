"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, Edit2 } from "lucide-react"

interface Proker {
  id: string
  title: string
  description: string
  status: "ongoing" | "archived"
  startDate: string
}

export default function ProkerManagement() {
  const [prokers, setProkers] = useState<Proker[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "ongoing" as const,
    startDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchProker()
  }, [])

  const fetchProker = async () => {
    try {
      const response = await fetch("/api/proker")
      if (response.ok) {
        const data = await response.json()
        setProkers(data)
      }
    } catch (error) {
      console.error("Failed to fetch proker:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/proker/${editingId}` : "/api/proker"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchProker()
        setFormData({
          title: "",
          description: "",
          status: "ongoing",
          startDate: new Date().toISOString().split("T")[0],
        })
        setShowForm(false)
        setEditingId(null)
      }
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (proker: Proker) => {
    setFormData({
      title: proker.title,
      description: proker.description,
      status: proker.status,
      startDate: proker.startDate.split("T")[0],
    })
    setEditingId(proker.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const response = await fetch(`/api/proker/${id}`, { method: "DELETE" })
      if (response.ok) await fetchProker()
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Manage Program Kerja</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({
                title: "",
                description: "",
                status: "ongoing",
                startDate: new Date().toISOString().split("T")[0],
              })
            }
          }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "Add Proker"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-light rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-light rounded"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "ongoing" | "archived" })}
                  className="w-full px-4 py-2 border border-neutral-light rounded"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-light rounded"
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
              {isLoading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : prokers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded text-neutral-medium">No proker added yet.</div>
      ) : (
        <div className="space-y-3">
          {prokers.map((proker) => (
            <div key={proker.id} className="bg-white p-4 rounded shadow flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{proker.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded font-semibold ${proker.status === "ongoing" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {proker.status}
                  </span>
                </div>
                <p className="text-sm text-neutral-medium">{proker.description}</p>
                <p className="text-xs text-accent mt-1">{new Date(proker.startDate).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(proker)} className="p-2 text-accent hover:bg-neutral-light rounded">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(proker.id)} className="p-2 text-red-600 hover:bg-red-100 rounded">
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
