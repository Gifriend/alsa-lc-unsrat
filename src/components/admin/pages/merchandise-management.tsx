"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, Edit2 } from "lucide-react"

interface Merchandise {
  id: string
  name: string
  description: string
  price: number
}

export default function MerchandiseManagement() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
  })

  useEffect(() => {
    fetchMerchandise()
  }, [])

  const fetchMerchandise = async () => {
    try {
      const response = await fetch("/api/merchandise")
      if (response.ok) {
        const data = await response.json()
        setMerchandise(data)
      }
    } catch (error) {
      console.error("Failed to fetch merchandise:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/merchandise/${editingId}` : "/api/merchandise"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchMerchandise()
        setFormData({ name: "", description: "", price: 0 })
        setShowForm(false)
        setEditingId(null)
      }
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item: Merchandise) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const response = await fetch(`/api/merchandise/${id}`, { method: "DELETE" })
      if (response.ok) await fetchMerchandise()
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Manage Merchandise</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({ name: "", description: "", price: 0 })
            }
          }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "Add Item"}
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
              <label className="block text-sm font-bold mb-2">Price (Rp)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
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
      ) : merchandise.length === 0 ? (
        <div className="text-center py-12 bg-white rounded text-neutral-medium">No merchandise added yet.</div>
      ) : (
        <div className="space-y-3">
          {merchandise.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-neutral-medium">{item.description}</p>
                <p className="text-accent font-bold mt-2">Rp {item.price.toLocaleString("id-ID")}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="p-2 text-accent hover:bg-neutral-light rounded">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded">
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
