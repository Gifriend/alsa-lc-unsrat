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
    <main className="min-h-screen bg-[#f8faff] text-gray-900 flex flex-col justify-between">
      <div>
        <Navigation />

        {/* Hero Header Banner */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0e2544] via-[#163967] to-[#1d4880] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/15 via-transparent to-transparent pointer-events-none" />
          <div className="container-custom relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
              <span>Community</span>
              <span>&bull;</span>
              <span>Internal & Alumni</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
              Members & Alumni Network
            </h1>
            <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Jaringan mahasiswa hukum aktif dan alumni ALSA Local Chapter Universitas
              Sam Ratulangi yang berkiprah di berbagai profesi hukum.
            </p>
          </div>
        </section>

        <section className="section-spacing container-custom max-w-5xl py-14">
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
