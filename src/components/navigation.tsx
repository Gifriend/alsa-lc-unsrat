"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      label: "About Us",
      children: [
        { href: "/history", label: "History" },
        { href: "/founders", label: "Founders" },
        { href: "/members", label: "Members" },
        { href: "/bod", label: "BOD" },
      ],
    },
    { href: "/achievements", label: "Achievements" },
    { href: "/proker", label: "Work" },
    { href: "/publications", label: "Publications" },
    {
      label: "More",
      children: [
        { href: "/resources", label: "Resources" },
        { href: "/merchandise", label: "Merchandise" },
      ],
    },
  ];

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center h-16">
        <div className="flex items-center">
          <Image
            src="/ALSA-logo-putih.png"
            alt="ALSA LC UNSRAT"
            width={100}
            height={100}
            className="mr-2"
          />
          <Link href="/" className="font-serif text-2xl font-bold">
            ALSA LC UNSRAT
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} />
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-primary-light overflow-hidden"
          >
            {navItems.map((item) => (
              <MobileNavItem key={item.label} item={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavItem({ item }: { item: any }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className="px-3 py-2 text-sm hover:bg-primary-light transition-colors rounded"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <button className="flex items-center px-3 py-2 text-sm hover:bg-primary-light transition-colors rounded">
        {item.label}
        <motion.span
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bg-primary-light text-white shadow-lg rounded-md mt-2 min-w-[150px]"
          >
            {item.children.map((child: any) => (
              <Link
                key={child.href}
                href={child.href}
                className="block px-4 py-2 hover:bg-primary-dark transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavItem({ item }: { item: any }) {
  const [isSubOpen, setIsSubOpen] = useState(false);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className="block px-4 py-2 hover:bg-primary-dark transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsSubOpen(!isSubOpen)}
        className="w-full flex items-center justify-between text-left px-4 py-2 hover:bg-primary-dark transition-colors"
      >
        {item.label}
        <motion.span
          animate={{ rotate: isSubOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isSubOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {item.children.map((child: any) => (
              <Link
                key={child.href}
                href={child.href}
                className="block px-6 py-2 hover:bg-primary-dark transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}