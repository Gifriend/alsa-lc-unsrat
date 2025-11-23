"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/history", label: "History" },
    { href: "/founders", label: "Founders" },
    { href: "/members", label: "Members" },
    { href: "/bod", label: "BOD" },
    { href: "/resources", label: "Resources" },
    { href: "/achievements", label: "Achievements" },
    { href: "/proker", label: "Proker" },
    { href: "/publications", label: "Publications" },
    { href: "/merchandise", label: "Merchandise" },
  ]

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center h-16">
        <Link href="/" className="font-serif text-2xl font-bold">
          ALSA LC Unsrat
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm hover:bg-primary-light transition-colors rounded"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="px-3 py-2 text-sm bg-accent hover:bg-accent-light transition-colors rounded ml-2"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary-light">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="block px-4 py-2 hover:bg-primary-dark transition-colors">
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className="block px-4 py-2 bg-accent hover:bg-accent-light transition-colors">
            Admin
          </Link>
        </div>
      )}
    </nav>
  )
}
