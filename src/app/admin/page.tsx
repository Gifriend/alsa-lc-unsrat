"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check")
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <AdminDashboard />
}
