"use client"

import type React from "react"

import { useState } from "react"
import AdminSidebar from "./admin-sidebar"
import AdminHeader from "./admin-header"
import FoundersManagement from "./pages/founders-management"
import BODManagement from "./pages/bod-management"
import ResourcesManagement from "./pages/resources-management"
import AchievementsManagement from "./pages/achievements-management"
import ProkerManagement from "./pages/proker-management"
import PublicationsManagement from "./pages/publications-management"
import MerchandiseManagement from "./pages/merchandise-management"
import MembersManagement from "./pages/members-management"
import HistoryManagement from "./pages/history-management" // Add this import

type PageType =
  | "founders"
  | "members"
  | "bod"
  | "resources"
  | "achievements"
  | "proker"
  | "publications"
  | "merchandise"
  | "history" // Add this

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>("founders")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderPage = () => {
    const pages: Record<PageType, React.ReactNode> = {
      founders: <FoundersManagement />,
      members: <MembersManagement />,
      bod: <BODManagement />,
      resources: <ResourcesManagement />,
      achievements: <AchievementsManagement />,
      proker: <ProkerManagement />,
      publications: <PublicationsManagement />,
      merchandise: <MerchandiseManagement />,
      history: <HistoryManagement />, 
    }
    return pages[currentPage]
  }

  return (
    <div className="min-h-screen bg-neutral-light flex">
      <AdminSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-8 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  )
}