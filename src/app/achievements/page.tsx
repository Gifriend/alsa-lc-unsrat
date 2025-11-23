"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  image?: string
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch("/api/achievements")
        if (response.ok) {
          const data = await response.json()
          setAchievements(data)
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  return (
    <main>
      <Navigation />
      <section className="section-spacing container-custom">
        <h1 className="mb-12">Achievements</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading achievements...</div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">No achievements found yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-5xl">
                  🏆
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-primary mb-2">{achievement.title}</h3>
                  <p className="text-neutral-medium mb-3">{achievement.description}</p>
                  <p className="text-accent text-sm font-semibold">{new Date(achievement.date).toLocaleDateString()}</p>
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
