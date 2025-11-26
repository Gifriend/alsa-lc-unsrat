"use client"

import { useEffect, useState } from "react"

interface Stats {
  activeMembers: number
  alumni: number
  localChapters: number
}

export default function InNumbers() {
  const [stats, setStats] = useState<Stats>({
    activeMembers: 0,
    alumni: 0,
    localChapters: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        // Fallback values
        setStats({
          activeMembers: 0,
          alumni: 0,
          localChapters: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const numbers = [
    { label: "Active Members", value: stats.activeMembers },
    { label: "Alumni", value: stats.alumni },
    // { label: "Local Chapters", value: stats.localChapters },
  ]

  return (
    <section className="section-spacing bg-neutral-light section-divider">
      <div className="container-custom">
        <h2 className="text-center mb-12">In Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {numbers.map((item) => (
            <div key={item.label} className="bg-white p-8 rounded shadow text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl md:text-5xl font-serif font-bold text-accent mb-2">
                {isLoading ? "-" : item.value.toLocaleString()}
              </div>
              <p className="text-neutral-medium font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
