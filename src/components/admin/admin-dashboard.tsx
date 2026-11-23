"use client";

import type React from "react";
import { useState } from "react";
import AdminSidebar, { PageType } from "./admin-sidebar";
import AdminHeader from "./admin-header";
import FoundersManagement from "./pages/founders-management";
import BODManagement from "./pages/bod-management";
import ResourcesManagement from "./pages/resources-management";
import AchievementsManagement from "./pages/achievements-management";
import ProkerManagement from "./pages/proker-management";
import PublicationsManagement from "./pages/publications-management";
import MerchandiseManagement from "./pages/merchandise-management";
import MembersManagement from "./pages/members-management";
import HistoryManagement from "./pages/history-management";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>("history");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pages: Record<PageType, { component: React.ReactNode; title: string }> = {
    history: { component: <HistoryManagement />, title: "History & Timeline" },
    bod: { component: <BODManagement />, title: "Board of Directors" },
    proker: { component: <ProkerManagement />, title: "Work Programs" },
    resources: { component: <ResourcesManagement />, title: "Legal Resources" },
    publications: { component: <PublicationsManagement />, title: "Publications" },
    merchandise: { component: <MerchandiseManagement />, title: "Merchandise" },
    achievements: { component: <AchievementsManagement />, title: "Achievements" },
    members: { component: <MembersManagement />, title: "Members & Alumni" },
    founders: { component: <FoundersManagement />, title: "Founding Fathers" },
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex text-gray-900">
      <AdminSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col md:ml-72 min-w-0">
        <AdminHeader
          currentPageTitle={pages[currentPage]?.title}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {pages[currentPage]?.component}
        </main>
      </div>
    </div>
  );
}