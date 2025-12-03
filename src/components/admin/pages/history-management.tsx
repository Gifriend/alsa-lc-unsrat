"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Save, X, Calendar, FileText } from "lucide-react"

interface HistoryItem {
  id: string
  year: string
  title: string
  description: string
}

interface HistoryFormData {
  year: string
  title: string
  description: string
}

export default function HistoryManagement() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<HistoryFormData>({
    year: "",
    title: "",
    description: "",
  })

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history")
      if (response.ok) {
        const data = await response. json()
        setHistoryItems(data)
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (! formData.year || !formData.title || !formData. description) {
      alert("Please fill all fields")
      return
    }

    try {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ year: "", title: "", description: "" })
        setIsAdding(false)
        fetchHistory()
      }
    } catch (error) {
      console.error("Error adding history:", error)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!formData.year || ! formData.title || !formData.description) {
      alert("Please fill all fields")
      return
    }

    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setEditingId(null)
        setFormData({ year: "", title: "", description: "" })
        fetchHistory()
      }
    } catch (error) {
      console.error("Error updating history:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this history item?")) return

    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      })

      if (response. ok) {
        setHistoryItems(historyItems.filter((item) => item.id !== id))
      }
    } catch (error) {
      console. error("Error deleting history:", error)
    }
  }

  const startEdit = (item: HistoryItem) => {
    setEditingId(item. id)
    setFormData({
      year: item.year,
      title: item.title,
      description: item. description,
    })
    setIsAdding(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({ year: "", title: "", description: "" })
  }

  const startAdd = () => {
    setIsAdding(true)
    setEditingId(null)
    setFormData({ year: "", title: "", description: "" })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-light rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3]. map((i) => (
              <div key={i} className="h-24 bg-neutral-light rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-neutral-light">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">
              History Management
            </h2>
            <p className="text-neutral-medium mt-1">
              Manage timeline history of ALSA LC UNSRAT
            </p>
          </div>
          <button
            onClick={startAdd}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus size={20} />
            Add History
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Add Form */}
        {isAdding && (
          <div className="bg-neutral-lightest p-6 rounded-lg mb-6 border border-neutral-light">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-accent" />
              Add New History
            </h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData. year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e. target.value })
                    }
                    className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="e.g., 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="Event title"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData. description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e. target.value })
                  }
                  className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  rows={3}
                  placeholder="Describe the historical event..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={18} />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 bg-neutral-medium text-white px-5 py-2 rounded-lg hover:bg-neutral-dark transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="space-y-4">
          {historyItems.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-neutral-light mb-4" />
              <p className="text-neutral-medium">
                No history items yet. Add your first one! 
              </p>
            </div>
          ) : (
            historyItems.map((item, index) => (
              <div
                key={item. id}
                className="bg-white border border-neutral-light rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {editingId === item.id ? (
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Year
                        </label>
                        <input
                          type="text"
                          value={formData. year}
                          onChange={(e) =>
                            setFormData({ ...formData, year: e. target.value })
                          }
                          className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData. description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdate(item.id)}
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save size={18} />
                        Update
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 bg-neutral-medium text-white px-5 py-2 rounded-lg hover:bg-neutral-dark transition-colors"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    {/* Bulatan dengan TAHUN, bukan nomor */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-center font-bold text-sm">
                        {item.year}
                      </div>
                      {index < historyItems. length - 1 && (
                        <div className="w-1 h-8 bg-neutral-light mt-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-xl font-bold text-primary">
                        {item.title}
                      </h3>
                      <p className="text-neutral-medium text-sm line-clamp-2 mt-1">
                        {item. description}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item. id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}