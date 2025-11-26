"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"
import Image from "next/image"

interface BODMember {
  id: string
  name: string
  position: string
  image?: string
  level: number
  order: number
}

export default function BODPage() {
  const [members, setMembers] = useState<BODMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBOD = async () => {
      try {
        const response = await fetch("/api/bod")
        if (response.ok) {
          const data = await response.json()
          setMembers(data)
        }
      } catch (error) {
        console.error("Failed to fetch BOD:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBOD()
  }, [])

  // Group members by level
  const groupedMembers = members.reduce(
    (acc, member) => {
      const level = member.level || 1
      if (!acc[level]) acc[level] = []
      acc[level].push(member)
      return acc
    },
    {} as Record<number, BODMember[]>,
  )

  // Sort members within each level by order
  Object.keys(groupedMembers).forEach((level) => {
    groupedMembers[Number(level)].sort((a, b) => (a.order || 0) - (b.order || 0))
  })

  const levels = Object.keys(groupedMembers)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <main>
      <Navigation />

      {/* Hero Banner */}
      <section className="relative h-64 bg-gradient-to-r from-primary to-primary-dark overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container-custom h-full flex items-end pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-white">Board</h1>
        </div>
      </section>

      <section className="section-spacing container-custom">
        <p className="text-primary font-medium mb-2">2024-2026</p>
        <h2 className="text-3xl md:text-4xl font-serif mb-12">The National Board</h2>

        {isLoading ? (
          <div className="text-center py-12">Loading board members...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">No board members found.</div>
        ) : (
          <div className="org-chart">
            {levels.map((level, levelIndex) => (
              <div key={level} className="relative">
                {/* Level row */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8">
                  {groupedMembers[level].map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      {/* Connector line from top */}
                      {levelIndex > 0 && <div className="w-px h-6 bg-primary mb-2" />}

                      {/* Photo */}
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-3 border-primary bg-gray-100 shadow-md">
                        {member.image ? (
                          <Image
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">?</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="text-center mt-3 max-w-32">
                        <p className="text-primary text-xs md:text-sm font-semibold leading-tight">{member.position}</p>
                        <p className="text-gray-800 text-sm md:text-base font-medium mt-1">{member.name}</p>
                      </div>

                      {/* Connector line to bottom */}
                      {levelIndex < levels.length - 1 && <div className="w-px h-6 bg-primary mt-4" />}
                    </div>
                  ))}
                </div>

                {/* Horizontal connector line between levels */}
                {levelIndex < levels.length - 1 && groupedMembers[level].length > 1 && (
                  <div className="flex justify-center mb-2">
                    <div
                      className="h-px bg-primary"
                      style={{
                        width: `${Math.min(80, groupedMembers[level].length * 15)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
