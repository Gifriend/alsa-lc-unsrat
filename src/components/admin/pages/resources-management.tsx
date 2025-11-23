"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, Edit2 } from "lucide-react"

interface Resource {
  id: string
  name: string
  description: string
  fileType: string
}

export default function ResourcesManagement() {
  const [resources, setResources] = useState<Resource[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fileType: "pdf",
  })

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

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchResources()
        setFormData({ name: "", description: "", fileType: "pdf" })
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
      fileType: resource.fileType,
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
              setFormData({ name: "", description: "", fileType: "pdf" })
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
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">File Type</label>
              <select
                value={formData.fileType}
                onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-light rounded"
              >
                <option>pdf</option>
                <option>docx</option>
                <option>xlsx</option>
                <option>pptx</option>
              </select>
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
