"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DirectorStatement() {
  return (
    <section className="relative z-20 pt-6 md:pt-10 container-custom px-4 mb-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_10px_35px_rgba(22,57,103,0.06)] border border-white/90 bg-white/75 backdrop-blur-md"
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
          {/* Left: Director Portrait with Bottom Translucent Caption */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="shrink-0 flex flex-col items-center"
          >
            <div className="relative w-48 sm:w-52 md:w-56 h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-md border-2 border-white/80 bg-slate-100 group">
              <Image
                src="/director_nathania_clean.png"
                alt="Nathania E. Kembuan - Director of ALSA LC Unsrat"
                fill
                sizes="(max-width: 768px) 210px, 240px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                priority
              />

              {/* Bottom Translucent Caption Box matching mockup */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-black/60 backdrop-blur-md text-white text-center rounded-b-2xl border-t border-white/10 z-10">
                <h4 className="font-sans font-bold text-xs sm:text-sm tracking-wide leading-tight">
                  Nathania E. Kembuan
                </h4>
                <p className="text-[10px] sm:text-[11px] text-gray-200 font-medium leading-tight mt-0.5">
                  Director of ALSA Local Chapter
                </p>
                <p className="text-[10px] sm:text-[11px] text-gray-200 font-medium leading-tight">
                  Universitas Sam Ratulangi
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Statement Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex-1 flex flex-col justify-center text-left"
          >
            <h3 className="font-sans text-xl sm:text-2xl md:text-3xl font-extrabold text-[#163967] leading-snug mb-4">
              Where Ideas Meet, People Grow, and Purpose Takes Shape.
            </h3>

            <div className="space-y-3.5 text-gray-600 text-xs sm:text-sm md:text-[15px] leading-relaxed">
              <p>
                We are a student organization committed to creating a space for
                learning, collaboration, leadership, and personal development.
                Being part of this organization means more than simply holding a
                position or participating in activities. It means challenging
                yourself, building meaningful connections, discovering new
                perspectives, and creating an impact that extends beyond yourself.
              </p>
              <p>
                Because every experience has the potential to shape who you
                become. Here, you will have the opportunity to learn beyond the
                classroom, take on meaningful responsibilities, meet people who
                inspire you, and transform your ideas into action.
              </p>
              <p className="font-bold text-[#163967] text-sm sm:text-base pt-1">
                Join us, grow with us, and make your experience count.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
