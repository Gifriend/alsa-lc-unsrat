"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    {
      label: "About Us",
      children: [
        { href: "/history", label: "History" },
        { href: "/founders", label: "Founders" },
        { href: "/members", label: "Members" },
        { href: "/achievements", label: "Achievements" },
      ],
    },
    { href: "/bod", label: "Board" },
    { href: "/proker", label: "Programs" },
    { href: "/publications", label: "Publications" },
    { href: "/merchandise", label: "Merchandise" },
    { href: "/resources", label: "Resources" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 text-[#163967] shadow-lg border-b border-gray-100 backdrop-blur-md"
          : "bg-slate-950/30 text-white border-b border-white/10 backdrop-blur-md"
      }`}
    >
      <div className="container-custom flex justify-between items-center h-18">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={isScrolled ? "/alsa-logo-merah.png" : "/ALSA-logo-putih.png"}
              alt="ALSA LC UNSRAT"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-serif text-lg md:text-xl font-bold tracking-tight transition-colors ${
                isScrolled ? "text-[#163967]" : "text-white"
              }`}
            >
              ALSA LC UNSRAT
            </span>
            <span
              className={`text-[10px] uppercase tracking-wider font-semibold -mt-1 ${
                isScrolled ? "text-gray-500" : "text-white/70"
              }`}
            >
              Univ. Sam Ratulangi
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-1 font-medium text-sm">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} isScrolled={isScrolled} />
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isScrolled
              ? "text-[#163967] hover:bg-gray-100"
              : "text-white hover:bg-white/10"
          }`}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`lg:hidden border-b overflow-hidden shadow-2xl ${
              isScrolled
                ? "bg-white text-[#163967] border-gray-200"
                : "bg-[#11294a]/95 text-white border-white/10 backdrop-blur-xl"
            }`}
          >
            <div className="container-custom py-4 space-y-1">
              {navItems.map((item) => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  isScrolled={isScrolled}
                  onClose={() => setIsOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItem({ item, isScrolled }: { item: any; isScrolled: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
          isScrolled
            ? "hover:bg-blue-50 hover:text-[#163967] text-gray-700 font-medium"
            : "hover:bg-white/15 text-white/90 hover:text-white"
        }`}
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
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
          isScrolled
            ? "hover:bg-blue-50 hover:text-[#163967] text-gray-700 font-medium"
            : "hover:bg-white/15 text-white/90 hover:text-white"
        }`}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full pt-2 w-48 z-50"
          >
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden text-gray-800">
              {item.children.map((child: any) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#163967] transition-colors"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavItem({
  item,
  isScrolled,
  onClose,
}: {
  item: any;
  isScrolled: boolean;
  onClose: () => void;
}) {
  const [isSubOpen, setIsSubOpen] = useState(false);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isScrolled
            ? "hover:bg-gray-100 text-gray-800"
            : "hover:bg-white/10 text-white"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsSubOpen(!isSubOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isScrolled
            ? "hover:bg-gray-100 text-gray-800"
            : "hover:bg-white/10 text-white"
        }`}
      >
        <span>{item.label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isSubOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isSubOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 space-y-1 overflow-hidden"
          >
            {item.children.map((child: any) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className={`block px-3 py-2 rounded-lg text-xs transition-colors ${
                  isScrolled
                    ? "text-gray-600 hover:text-[#163967] hover:bg-gray-50"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
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
