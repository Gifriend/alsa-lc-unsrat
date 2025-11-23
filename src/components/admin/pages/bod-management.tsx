"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, Edit2 } from "lucide-react"

interface BODMember {
  id: string
  name: string
  position: string
}

export default function BODManagement() {
  const [members, setMembers] = useState<BODMember[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
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
        setFormData({ name: "", position: "" })
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
    setFormData({ name: member.name, position: member.position })
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
              setFormData({ name: "", position: "" })
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
            <div>
              <label className="block text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-light rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Position</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-light rounded"
              />
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
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b hover:bg-neutral-light">
                  <td className="px-4 py-3">{member.name}</td>
                  <td className="px-4 py-3">{member.position}</td>
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
