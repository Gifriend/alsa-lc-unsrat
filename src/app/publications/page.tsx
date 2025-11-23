"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"
import { Download } from "lucide-react"

interface Publication {
  id: string
  title: string
  year: number
  authors: string[]
  pdfUrl: string
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number | "all">("all")

  useEffect(() => {
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

    fetchPublications()
  }, [])

  const years = Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a)
  const filteredPublications =
    selectedYear === "all" ? publications : publications.filter((p) => p.year === selectedYear)

  return (
    <main>
      <Navigation />
      <section className="section-spacing container-custom">
        <h1 className="mb-12">Academic Publications</h1>

        {!isLoading && years.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedYear("all")}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                selectedYear === "all" ? "bg-accent text-white" : "bg-neutral-light hover:bg-primary hover:text-white"
              }`}
            >
              All Years
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded font-semibold transition-colors ${
                  selectedYear === year ? "bg-accent text-white" : "bg-neutral-light hover:bg-primary hover:text-white"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">Loading publications...</div>
        ) : filteredPublications.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">No publications found.</div>
        ) : (
          <div className="space-y-4">
            {filteredPublications.map((pub) => (
              <div
                key={pub.id}
                className="bg-white border border-ring rounded p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold text-primary mb-1">{pub.title}</h3>
                    <p className="text-neutral-medium text-sm mb-2">{pub.authors}</p>
                    <p className="text-accent text-sm font-semibold">{pub.year}</p>
                  </div>
                  <a
                    href={pub.pdfUrl}
                    download
                    className="p-3 bg-accent hover:bg-accent-light text-white rounded transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Download size={18} />
                    <span className="hidden sm:inline">PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
