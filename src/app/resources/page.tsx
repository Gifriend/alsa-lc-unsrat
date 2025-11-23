"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"
import { Download } from "lucide-react"

interface Resource {
  id: string
  name: string
  description: string
  fileUrl: string
  fileType: string
  uploadedAt: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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

    fetchResources()
  }, [])

  return (
    <main>
      <Navigation />
      <section className="section-spacing container-custom">
        <h1 className="mb-12">Resources - ART ALSA Unsrat</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">No resources available yet.</div>
        ) : (
          <div className="max-w-3xl space-y-4">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white border border-neutral-light rounded p-6 hover:shadow-lg transition-shadow flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-primary mb-1">{resource.name}</h3>
                  <p className="text-neutral-medium text-sm mb-2">{resource.description}</p>
                  <p className="text-xs text-neutral-medium">
                    {resource.fileType.toUpperCase()} • Uploaded {new Date(resource.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={resource.fileUrl}
                  download
                  className="ml-4 p-3 bg-accent hover:bg-accent-light text-white rounded transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
