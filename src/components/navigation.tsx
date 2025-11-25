"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/history", label: "History" },
    { href: "/founders", label: "Founders" },
    { href: "/members", label: "Members" },
    { href: "/bod", label: "BOD" },
    { href: "/resources", label: "Resources" },
    { href: "/achievements", label: "Achievements" },
    { href: "/proker", label: "Work" },
    { href: "/publications", label: "Publications" },
    { href: "/merchandise", label: "Merchandise" },
  ];

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center h-16">
        <Image
            src="/ALSA-logo-putih.png"
            alt="ALSA LC UNSRAT"
            width={100}
            height={100}
            className="inline-block mr-2"
          />
        <Link href="/" className="font-serif text-2xl font-bold">
          ALSA LC UNSRAT
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
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary-light">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 hover:bg-primary-dark transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
