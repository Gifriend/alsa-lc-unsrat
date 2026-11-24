"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, ImageIcon } from "lucide-react" 
import { Skeleton } from "@/components/ui/skeleton" 

interface AchievementDetail {
  id: string
  title: string
  description: string
  date: string
  imageUrl?: string
  updatedAt?: any
}

export default function AchievementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [achievement, setAchievement] = useState<AchievementDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Pastikan ID ada sebelum fetch
    if (!params.id) return

    const fetchDetail = async () => {
      try {
        const response = await fetch(`/api/achievements/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setAchievement(data)
        } else {
            // Jika tidak ketemu, kembali ke list
           router.push('/achievements')
        }
      } catch (error) {
        console.error("Failed to fetch achievement detail:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [params.id, router])

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col bg-[#f8faff]">
        <Navigation />
        <div className="flex-1 container-custom max-w-4xl py-14 space-y-6">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-8 w-4/5 rounded-md" />
            </div>
            <Skeleton className="h-80 w-full rounded-2xl" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!achievement) return null

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      
      <article className="flex-1 container-custom py-12 max-w-4xl mx-auto w-full">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-neutral-medium hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Achievements
        </button>

        <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-primary mb-4 leading-tight">
                {achievement.title}
            </h1>
            <div className="flex items-center text-neutral-medium">
                <Calendar size={18} className="mr-2 text-accent" />
                <time>
                    {new Date(achievement.date).toLocaleDateString("id-ID", {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </time>
            </div>
        </header>

        <div className="w-full rounded-xl overflow-hidden shadow-lg mb-10 bg-gray-50 border border-gray-100">
            {achievement.imageUrl ? (
                <img 
                    src={achievement.imageUrl} 
                    alt={achievement.title} 
                    className="w-full h-auto max-h-[600px] object-contain mx-auto"
                />
            ) : (
                <div className="w-full h-64 md:h-96 flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon size={64} strokeWidth={1} />
                    <p className="text-gray-400 text-sm mt-2 font-medium">No image provided</p>
                </div>
            )}
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {achievement.description}
        </div>

      </article>

      <Footer />
    </main>
  )
}