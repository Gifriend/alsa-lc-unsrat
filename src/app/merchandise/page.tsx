"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"
import { ShoppingBag, ImageIcon } from "lucide-react" 

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
    <main className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <section className="section-spacing container-custom flex-1 py-12">
        <h1 className="mb-12 text-3xl font-bold font-serif text-primary">Merchandise</h1>

        {isLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3].map((i) => (
               <div key={i} className="bg-gray-100 h-96 rounded-xl animate-pulse"></div>
             ))}
           </div>
        ) : merchandise.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl text-neutral-medium border border-gray-100">
            <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="font-medium text-gray-400">No merchandise available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 hover:cursor-pointer">
            {merchandise.map((item) => (
              <div key={item.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                
                {/* Bagian Gambar / Placeholder */}
                <div className="h-72 w-full bg-gray-50 overflow-hidden relative flex items-center justify-center">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    // PLACEHOLDER IMAGE (Pengganti Emoji)
                    <div className="flex flex-col items-center justify-center text-gray-300">
                        <ShoppingBag size={64} strokeWidth={1} />
                        <span className="text-xs font-medium mt-2 text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                {/* Bagian Info */}
                <div className="p-6 flex flex-col flex-1 bg-primary">
                  <h3 className="font-serif text-xl font-bold text-background mb-2 line-clamp-1 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-background text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-background">
                      Rp {item.price.toLocaleString("id-ID")}
                    </span>
                    <button className="bg-background text-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-background/70 hover:cursor-pointer transition-colors shadow-sm">
                      Order Now
                    </button>
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