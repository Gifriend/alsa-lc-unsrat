"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Headphones,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#163967] text-white border-t border-blue-900/60">
      <div className="container-custom pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 pb-12 border-b border-white/15">
          {/* Organization Brand & Logo */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12">
                  <Image
                    src="/ALSA-logo-putih.png"
                    alt="ALSA LC UNSRAT"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-white mb-0">
                    ALSA LC UNSRAT
                  </h3>
                  <p className="text-xs text-blue-200 tracking-wider uppercase font-semibold">
                    Universitas Sam Ratulangi
                  </p>
                </div>
              </div>

              <p className="text-sm text-blue-100/80 leading-relaxed max-w-sm mb-6">
                Asian Law Students&apos; Association Local Chapter Universitas Sam
                Ratulangi. A premier student organization dedicated to connecting,
                developing, and empowering future legal leaders.
              </p>
            </div>

            <p className="text-xs text-blue-300 font-medium italic">
              &quot;Connect The Difference, Together We Develop.&quot;
            </p>
          </div>

          {/* Contact Us Details */}
          <div className="md:col-span-4">
            <h4 className="font-serif text-xl font-bold text-white mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-blue-100">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-blue-200">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-xs text-blue-300 block font-medium">
                    Phone / WhatsApp
                  </span>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-white font-medium"
                  >
                    +62 812-3456-7890
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-blue-200">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-xs text-blue-300 block font-medium">
                    Official Email
                  </span>
                  <a
                    href="mailto:alsalcunsrat@gmail.com"
                    className="hover:underline text-white font-medium"
                  >
                    alsalcunsrat@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-blue-200 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-xs text-blue-300 block font-medium">
                    Secretariat Address
                  </span>
                  <p className="text-white leading-snug">
                    Fakultas Hukum Universitas Sam Ratulangi, Jl. Kampus Unsrat,
                    Bahu, Manado, Sulawesi Utara 95115
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Follow Us / Social Links */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-xl font-bold text-white mb-5">
              Follow Us
            </h4>
            <p className="text-xs text-blue-200/80 mb-4">
              Stay connected with our latest updates, activities, and legal
              publications:
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://www.instagram.com/alsalcunsrat/?hl=id"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              >
                <Instagram size={18} />
              </a>

              <a
                href="https://www.facebook.com/alsalcunsrat/?locale=id_ID"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              >
                <Facebook size={18} />
              </a>

              <a
                href="https://twitter.com/alsalcunsrat"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              >
                <Twitter size={18} />
              </a>

              <a
                href="https://www.youtube.com/@alsalcunsrat"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              >
                <Youtube size={18} />
              </a>

              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Spotify Podcast"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              >
                <Headphones size={18} />
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/auth/login"
                className="text-xs text-blue-300/70 hover:text-white transition-colors"
              >
                Admin Portal &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/70">
          <p>&copy; {currentYear} ALSA LC UNSRAT. All rights reserved.</p>
          <p className="font-semibold text-white">ALSA, Always Be One!</p>
        </div>
      </div>
    </footer>
  );
}
