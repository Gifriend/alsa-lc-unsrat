"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ImageIcon } from "lucide-react" // Import icon Image

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  imageUrl?: string
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
        <h1 className="mb-12 text-3xl font-bold">Achievements</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Skeleton Loading sederhana */}
             {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
             ))}
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">No achievements found yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement) => (
              <Link 
                href={`/achievements/${achievement.id}`} 
                key={achievement.id}
                className="group block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Bagian Gambar / Placeholder */}
                <div className="h-48 w-full bg-gray-50 relative overflow-hidden flex items-center justify-center">
                  {achievement.imageUrl ? (
                    <img 
                      src={achievement.imageUrl} 
                      alt={achievement.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    // PLACEHOLDER STYLE (SHADCN-LIKE)
                    <div className="flex flex-col items-center justify-center text-gray-300">
                      <ImageIcon size={48} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Bagian Konten */}
                <div className="p-6 bg-primary">
                  <h3 className="font-serif text-xl font-bold text-background mb-2 line-clamp-1">
                    {achievement.title}
                  </h3>
                  <p className="text-background mb-3 line-clamp-2 text-sm">
                    {achievement.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-background text-xs font-semibold px-2 py-1 bg-accent/10 rounded">
                       {new Date(achievement.date).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                       })}
                    </span>
                    <span className="text-background text-sm font-medium group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}