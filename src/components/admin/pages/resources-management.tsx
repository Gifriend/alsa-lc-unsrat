"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Trash2, Edit2, FileText, X, Image, Archive, File } from "lucide-react"

interface ResourceFile {
  id: string
  resource_id: string
  file_name: string
  file_url: string
  file_type: string
  created_at: string
}

interface Resource {
  id: string
  name: string
  description: string
  file_type: string | null
  file_url: string | null
  category: string
  created_at: string
  updated_at: string
  resource_files: ResourceFile[]
}

export default function ResourcesManagement() {
  const [resources, setResources] = useState<Resource[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other",
  })
  const [files, setFiles] = useState<File[]>([])
  const [keepFileIds, setKeepFileIds] = useState<string[]>([])

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    setIsLoading(true)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e. target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleKeepFile = (fileId: string) => {
    setKeepFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = new FormData()
      data. append("name", formData.name)
      data.append("description", formData.description)
      data.append("category", formData.category)

      // Append all new files
      files.forEach((file) => {
        data.append("files", file)
      })

      if (editingId) {
        // EDIT MODE
        // Append keepFileIds
        keepFileIds. forEach((id) => {
          data.append("keepFileIds", id)
        })

        const response = await fetch(`/api/resources/${editingId}`, {
          method: "PUT",
          body: data,
        })

        if (response.ok) {
          alert("Resource updated successfully!")
          await fetchResources()
          resetForm()
        } else {
          const error = await response.json()
          alert(`Failed to update: ${error. message}`)
        }
      } else {
        // CREATE MODE
        if (files.length === 0) {
          alert("Please select at least one file")
          setIsLoading(false)
          return
        }

        const response = await fetch("/api/resources", {
          method: "POST",
          body: data,
        })

        if (response.ok) {
          alert("Resource created successfully!")
          await fetchResources()
          resetForm()
        } else {
          const error = await response.json()
          alert(`Failed to create: ${error. message}`)
        }
      }
    } catch (error) {
      console.error("Failed to save resource:", error)
      alert("Failed to save resource.  Check console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", category: "other" })
    setFiles([])
    setKeepFileIds([])
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (resource: Resource) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Set form data
    setFormData({
      name: resource.name,
      description: resource.description,
      category: resource.category,
    })
    
    // Set keepFileIds with all existing files (default: keep all)
    setKeepFileIds(resource.resource_files?.map((f) => f.id) || [])
    
    // Clear new files
    setFiles([])
    
    // Set editing mode
    setEditingId(resource.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (! confirm("Are you sure you want to delete this resource and all its files? ")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/resources/${id}`, { method: "DELETE" })
      if (response.ok) {
        alert("Resource deleted successfully!")
        await fetchResources()
      } else {
        const error = await response.json()
        alert(`Failed to delete: ${error.message}`)
      }
    } catch (error) {
      console.error("Failed to delete:", error)
      alert("Failed to delete resource")
    } finally {
      setIsLoading(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(type)) {
      return <Image size={18} className="text-purple-500" />
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(type)) {
      return <Archive size={18} className="text-orange-500" />
    }
    if (['pdf']. includes(type)) {
      return <FileText size={18} className="text-red-500" />
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(type)) {
      return <FileText size={18} className="text-blue-500" />
    }
    if (['xls', 'xlsx', 'csv'].includes(type)) {
      return <FileText size={18} className="text-green-500" />
    }
    if (['ppt', 'pptx'].includes(type)) {
      return <FileText size={18} className="text-orange-500" />
    }
    return <File size={18} className="text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / 1048576). toFixed(2) + ' MB'
  }

  const editingResource = resources.find((r) => r.id === editingId)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Resources</h2>
        <button
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Resource"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8 border border-gray-200">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            {editingId ? " Edit Resource" : " Add New Resource"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                Resource Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter resource name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter resource description"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="official">Official Document</option>
                <option value="other">Other Content</option>
              </select>
            </div>

            {/* Existing Files (Edit Mode) */}
            {editingId && editingResource && editingResource.resource_files && editingResource.resource_files.length > 0 && (
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700">
                  Existing Files ({editingResource.resource_files. length})
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {editingResource.resource_files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        keepFileIds.includes(file.id)
                          ? "bg-green-50 border-2 border-green-300"
                          : "bg-red-50 border-2 border-red-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(file.file_type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.file_name}</p>
                          <p className="text-xs text-gray-500">
                            {file.file_type?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleKeepFile(file. id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                          keepFileIds.includes(file. id)
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        {keepFileIds. includes(file.id) ? "✓ Keep" : "✗ Delete"}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Click "Keep" to retain files, or "Delete" to remove them when you update. 
                </p>
              </div>
            )}

            {/* Upload New Files */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                {editingId ? "Add More Files (Optional)" : "Upload Files *"}
              </label>
              <input
                type="file"
                multiple
                accept=". pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.csv,.zip,.rar,.jpg,.jpeg,.png,.gif,.svg,.json,.xml"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                📎 Supported: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP, RAR, JPG, PNG, GIF, SVG, JSON, XML
              </p>

              {files.length > 0 && (
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                  <p className="text-sm font-semibold text-gray-700">New Files ({files.length}):</p>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(file.name.split('.').pop() || '')}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "⏳ Saving..." : editingId ? "Update Resource" : "Create Resource"}
            </button>
          </form>
        </div>
      )}

      {isLoading ?  (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading... </p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No resources added yet.</p>
          <p className="text-gray-400 text-sm mt-2">Click "Add Resource" to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{resource.name}</h3>
                  <p className="text-gray-600 mb-2">{resource.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-semibold">
                      {resource.category === "official" ? "📄 Official Document" : "📁 Other Content"}
                    </span>
                    <span>•</span>
                    <span>{new Date(resource.created_at). toLocaleDateString()}</span>
                    {resource.resource_files && resource.resource_files.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{resource.resource_files.length} file(s)</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(resource)}
                    className="p-3 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit Resource"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="p-3 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Resource"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Files List */}
              {resource.resource_files && resource. resource_files.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    📎 Attached Files ({resource.resource_files.length}):
                  </p>
                  <div className="grid gap-2">
                    {resource.resource_files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {getFileIcon(file.file_type)}
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm font-medium flex-1 truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {file.file_name}
                        </a>
                        <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded whitespace-nowrap">
                          {file.file_type?.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}