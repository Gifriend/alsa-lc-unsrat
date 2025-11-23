import { Instagram, Facebook, Globe, Mail } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white section-divider">
      <div className="container-custom section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-serif text-xl font-bold mb-4">About ALSA LC Unsrat</h3>
            <p className="text-neutral-light mb-4">
              Asian Law Students Association - Local Chapter Universitas Sam Ratulangi. Connecting and developing future
              law leaders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/history" className="hover:text-accent-light transition-colors">
                  History
                </Link>
              </li>
              <li>
                <Link href="/founders" className="hover:text-accent-light transition-colors">
                  Founders
                </Link>
              </li>
              <li>
                <Link href="/bod" className="hover:text-accent-light transition-colors">
                  Board of Directors
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-accent-light transition-colors">
                  Achievements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-serif text-xl font-bold mb-4">Contact</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Website" className="hover:text-accent transition-colors">
                <Globe size={20} />
              </a>
              <a href="mailto:info@alsa.unsrat" aria-label="Email" className="hover:text-accent transition-colors">
                <Mail size={20} />
              </a>
            </div>
            <p className="text-sm">Manado, North Sulawesi, Indonesia</p>
          </div>
        </div>

        <div className="border-t border-primary-light pt-6 text-center text-sm">
          <p>&copy; {currentYear} ALSA LC Unsrat. All rights reserved.</p>
          <p className="text-neutral-light mt-2">Always be one!</p>
        </div>
      </div>
    </footer>
  )
}
