"use client"

import { Menu, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminHeaderProps {
  onMenuClick: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <header className="bg-white border-b border-neutral-light shadow-sm">
      <div className="flex items-center justify-between p-4 md:p-6">
        <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-neutral-light rounded" aria-label="Toggle menu">
          <Menu size={24} />
        </button>
        <h1 className="font-serif text-2xl font-bold text-primary">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white rounded transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
