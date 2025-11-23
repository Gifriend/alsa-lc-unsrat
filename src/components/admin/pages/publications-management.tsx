"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, Edit2 } from "lucide-react"

interface Publication {
  id: string
  title: string
  authors: string
  year: number
}

export default function PublicationsManagement() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    year: new Date().getFullYear(),
  })

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      const response = await fetch("/api/publications")
      if (response.ok) {
        const data = await response.json()
        setPublications(data)
      }
    } catch (error) {
      console.error("Failed to fetch publications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/publications/${editingId}` : "/api/publications"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchPublications()
        setFormData({ title: "", authors: "", year: new Date().getFullYear() })
        setShowForm(false)
        setEditingId(null)
      }
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (publication: Publication) => {
    setFormData({
      title: publication.title,
      authors: publication.authors,
      year: publication.year,
    })
    setEditingId(publication.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const response = await fetch(`/api/publications/${id}`, { method: "DELETE" })
      if (response.ok) await fetchPublications()
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Manage Publications</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({ title: "", authors: "", year: new Date().getFullYear() })
            }
          }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "Add Publication"}
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
                className="w-full px-4 py-2 border border-ring rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Authors</label>
              <input
                type="text"
                required
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                className="w-full px-4 py-2 border border-ring rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Year</label>
              <input
                type="number"
                required
                min="1950"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-ring rounded"
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
              {isLoading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : publications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded text-neutral-medium">No publications added yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Authors</th>
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((publication) => (
                <tr key={publication.id} className="border-b hover:bg-neutral-light">
                  <td className="px-4 py-3 truncate max-w-xs">{publication.title}</td>
                  <td className="px-4 py-3">{publication.authors}</td>
                  <td className="px-4 py-3">{publication.year}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(publication)}
                      className="p-2 text-accent hover:bg-neutral-light rounded"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(publication.id)}
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
