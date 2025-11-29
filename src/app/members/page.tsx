"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"

interface MemberStats {
  activeMembers: number
  alumni: number
}

export default function MembersPage() {
  const [stats, setStats] = useState<MemberStats>({ activeMembers: 0, alumni: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/member-stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch member stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <main>
      <Navigation />

      <section className="relative h-64 bg-primary overflow-hidden">
        <div className="relative container-custom h-full flex items-end pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-white">Members & Alumni</h1>
        </div>
      </section>


      <section className="section-spacing container-custom">

        {isLoading ? (
          <div className="text-center py-12">Loading members...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
            <div className="bg-primary text-white p-12 rounded shadow text-center">
              <div className="text-5xl font-serif font-bold mb-3">{stats.activeMembers}</div>
              <p className="text-lg">Active Members</p>
            </div>
            <div className="bg-accent text-white p-12 rounded shadow text-center">
              <div className="text-5xl font-serif font-bold mb-3">{stats.alumni}</div>
              <p className="text-lg">Alumni</p>
            </div>
          </div>
        )}

        <div className="mt-12 bg-neutral-light p-8 rounded">
          <h2>Membership Benefits</h2>
          <ul className="space-y-3 text-neutral-medium">
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Access to networking events and seminars</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Connection with law professionals and peers</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Professional development opportunities</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>International exposure and exchange programs</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Alumni support and mentorship</span>
            </li>
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  )
}
