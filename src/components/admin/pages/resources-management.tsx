"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, Edit2 } from "lucide-react"

interface Resource {
  id: string
  name: string
  description: string
  file_url?: string
  category: string  // Tambah category
}

export default function ResourcesManagement() {
  const [resources, setResources] = useState<Resource[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other",  // Default category
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources")
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/resources/${editingId}` : "/api/resources"

      const data = new FormData()
      data.append("name", formData.name)
      data.append("description", formData.description)
      data.append("category", formData.category)
      if (file) {
        data.append("file", file)
      }

      const response = await fetch(url, {
        method,
        body: data,
      })

      if (response.ok) {
        await fetchResources()
        setFormData({ name: "", description: "", category: "other" })
        setFile(null)
        setShowForm(false)
        setEditingId(null)
      }
    } catch (error) {
      console.error("Failed to save resource:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (resource: Resource) => {
    setFormData({
      name: resource.name,
      description: resource.description,
      category: resource.category,
    })
    setEditingId(resource.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const response = await fetch(`/api/resources/${id}`, { method: "DELETE" })
      if (response.ok) await fetchResources()
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Manage Resources</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({ name: "", description: "", category: "other" })
              setFile(null)
            }
          }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "Add Resource"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Resource Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-ring rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-ring rounded"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-ring rounded"
              >
                <option value="official">Official Document</option>
                <option value="other">Other Content</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Upload File</label>
              <input
                type="file"
                accept=".pdf,.docx,.xlsx,.pptx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-ring rounded"
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
              {isLoading ? "Saving..." : "Save Resource"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded text-neutral-medium">No resources added yet.</div>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{resource.name}</h3>
                <p className="text-sm text-neutral-medium">{resource.description}</p>
                <p className="text-sm text-neutral-medium">Category: {resource.category === 'official' ? 'Official Document' : 'Other Content'}</p>
                {resource.file_url && (
                  <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                    View File
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(resource)} className="p-2 text-accent hover:bg-neutral-light rounded">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(resource.id)} className="p-2 text-red-600 hover:bg-red-100 rounded">
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