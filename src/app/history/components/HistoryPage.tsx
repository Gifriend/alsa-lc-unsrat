"use client"

import { useEffect, useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

interface HistoryItem {
  id: string
  year: string
  title: string
  description: string
}

export default function HistoryPage() {
  const [timeline, setTimeline] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history")
      if (response.ok) {
        const data = await response.json()
        setTimeline(data)
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main>
        <Navigation />
        <section className="relative h-64 bg-primary overflow-hidden">
          <div className="relative container-custom h-full flex items-end pb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-white">
              History Of - ALSA LC UNSRAT
            </h1>
          </div>
        </section>
        <section className="section-spacing container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p>Loading... </p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Navigation />
      <section className="relative h-64 bg-primary overflow-hidden">
        <div className="relative container-custom h-full flex items-end pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-white">
            History Of - ALSA LC UNSRAT
          </h1>
        </div>
      </section>

      <section className="section-spacing container-custom">
        <div className="max-w-3xl mx-auto">
          {timeline.length === 0 ? (
            <p className="text-center text-neutral-medium">No history data available. </p>
          ) : (
            timeline.map((item, index) => (
              <div key={item.id} className="flex gap-6 mb-8 relative">
                <div className="flex flex-col items-center">
                  {/* Bulatan dengan TAHUN */}
                  <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-center font-bold text-sm">
                    {item. year}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-1 h-16 bg-neutral-light mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-serif text-2xl font-bold text-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-neutral-medium">{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}