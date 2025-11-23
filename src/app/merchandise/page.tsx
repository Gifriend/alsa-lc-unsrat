"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"

interface Merchandise {
  id: string
  name: string
  description: string
  price: number
  image?: string
}

export default function MerchandisePage() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMerchandise = async () => {
      try {
        const response = await fetch("/api/merchandise")
        if (response.ok) {
          const data = await response.json()
          setMerchandise(data)
        }
      } catch (error) {
        console.error("Failed to fetch merchandise:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMerchandise()
  }, [])

  return (
    <main>
      <Navigation />
      <section className="section-spacing container-custom">
        <h1 className="mb-12">Merchandise</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading merchandise...</div>
        ) : merchandise.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">No merchandise available yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchandise.map((item) => (
              <div key={item.id} className="bg-white rounded shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 bg-linear-to-br from-primary to-primary-light flex items-center justify-center text-5xl">
                  👕
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg font-bold text-primary mb-2">{item.name}</h3>
                  <p className="text-neutral-medium text-sm mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-serif font-bold text-accent">
                      Rp {item.price.toLocaleString("id-ID")}
                    </span>
                    <button className="btn-primary text-sm">Order</button>
                  </div>
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
