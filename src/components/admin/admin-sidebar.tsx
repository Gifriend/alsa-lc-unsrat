"use client"
import { X } from "lucide-react"

type PageType =
  | "founders"
  | "members"
  | "bod"
  | "resources"
  | "achievements"
  | "proker"
  | "publications"
  | "merchandise"

interface AdminSidebarProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ currentPage, onPageChange, isOpen, onClose }: AdminSidebarProps) {
  const menuItems: Array<{ label: string; page: PageType }> = [
    { label: "Founders", page: "founders" },
    { label: "Members & Alumni", page: "members" },
    { label: "Board of Directors", page: "bod" },
    { label: "Resources", page: "resources" },
    { label: "Achievements", page: "achievements" },
    { label: "Work", page: "proker" },
    { label: "Publications", page: "publications" },
    { label: "Merchandise", page: "merchandise" },
  ]

  const handleClick = (page: PageType) => {
    onPageChange(page)
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-transparent  md:hidden z-40" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-primary text-white shadow-lg
          transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 border-b border-primary-light flex justify-between items-center">
          <h2 className="font-serif text-xl font-bold text-white">Menu</h2>
          <button onClick={onClose} className="md:hidden hover:bg-primary-light p-1 rounded">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleClick(item.page)}
              className={`w-full text-left px-4 py-3 rounded mb-2 transition-colors ${
                currentPage === item.page ? "bg-accent text-white" : "hover:bg-primary-light"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
