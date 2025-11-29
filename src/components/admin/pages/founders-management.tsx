"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, Edit2 } from "lucide-react"

interface Founder {
  id: string
  name: string
  period: string
  description: string
}

export default function FoundersManagement() {
  const [founders, setFounders] = useState<Founder[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    period: "",
    description: "",
  })

  useEffect(() => {
    fetchFounders()
  }, [])

  const fetchFounders = async () => {
    try {
      const response = await fetch("/api/founders")
      if (response.ok) {
        const data = await response.json()
        setFounders(data)
        console.log("Fetched founders:", data);
      }
    } catch (error) {
      console.error("Failed to fetch founders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.period || !formData.description) {
      alert("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/founders/${editingId}` : "/api/founders"

      console.log("[v0] Submitting to:", url, "Method:", method, "ID:", editingId)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error(" API Error:", error)
        alert(`Error: ${error.message || "Failed to save founder"}`)
        return
      }

      await fetchFounders()
      setFormData({ name: "", period: "", description: "" })
      setShowForm(false)
      setEditingId(null)
    } catch (error) {
      console.error("[v0] Failed to save founder:", error)
      alert("Failed to save founder. Check console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (founder: Founder) => {
    setFormData({
      name: founder.name,
      period: founder.period,
      description: founder.description,
    })
    setEditingId(founder.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/founders/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchFounders()
      }
    } catch (error) {
      console.error("Failed to delete founder:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Manage Founders</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({ name: "", period: "", description: "" })
            }
          }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "Add Founder"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Period (e.g., 2000-2002)</label>
              <input
                type="text"
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:border-accent"
                rows={4}
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
              {isLoading ? "Saving..." : editingId ? "Update Founder" : "Save Founder"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : founders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded text-neutral-medium">No founders added yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Period</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {founders.map((founder) => (
                <tr key={founder.id} className="border-b hover:bg-neutral-light">
                  <td className="px-4 py-3">{founder.name}</td>
                  <td className="px-4 py-3">{founder.period}</td>
                  <td className="px-4 py-3 truncate max-w-xs">{founder.description}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(founder)}
                      className="p-2 text-accent hover:bg-neutral-light rounded"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(founder.id)}
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
