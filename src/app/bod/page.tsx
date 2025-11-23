"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"

interface BODMember {
  id: string
  name: string
  position: string
  image?: string
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

  return (
    <main>
      <Navigation />
      <section className="section-spacing container-custom">
        <h1 className="mb-12">Board of Directors</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading board members...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">No board members found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="h-56 bg-linear-to-br from-primary to-primary-light flex items-center justify-center text-5xl">
                  👤
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-serif text-xl font-bold text-primary mb-2">{member.name}</h3>
                  <p className="text-accent font-semibold">{member.position}</p>
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
