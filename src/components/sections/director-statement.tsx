"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function DirectorStatement() {
  return (
    <section className="relative z-20 -mt-12 md:-mt-20 container-custom px-4 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card rounded-3xl p-6 md:p-10 shadow-2xl border border-blue-100/70 bg-gradient-to-br from-white via-white/95 to-blue-50/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Director Portrait & Caption */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col items-center text-center"
          >
            <div className="relative w-52 h-64 md:w-60 md:h-72 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gradient-to-tr from-slate-200 to-blue-100 group">
              <Image
                src="/placeholder-user.jpg"
                alt="Director of ALSA Local Chapter Universitas Sam Ratulangi"
                fill
                sizes="(max-width: 768px) 210px, 240px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#163967]/80 via-transparent to-transparent opacity-60" />
            </div>

            {/* Caption Card */}
            <div className="mt-4 px-4 py-2.5 rounded-xl bg-white/90 border border-blue-100 shadow-md w-full max-w-[260px]">
              <h4 className="font-serif font-bold text-[#163967] text-base leading-snug">
                Nathania E. Kembuan
              </h4>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Director of ALSA LC Unsrat
              </p>
            </div>
          </motion.div>

          {/* Right: Statement Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-8 flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 mb-3">
              <Quote className="text-[#163967] w-8 h-8 opacity-40 rotate-180" />
              <span className="text-xs uppercase font-bold tracking-widest text-blue-600">
                Opening Statement
              </span>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-[#163967] leading-tight mb-5">
              Where Ideas Meet, People Grow, and Purpose Takes Shape.
            </h3>

            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                We are not just an organization committed to creating a space for
                learning, collaboration, leadership, and personal development.
                Being part of this organization means more than simply holding a
                position or participating in activities. It means challenging
                yourself, building meaningful connections, developing new
                perspectives, and creating an impact that extends beyond yourself.
              </p>
              <p>
                Because every experience has the potential to shape who you
                become. Here, you will have the opportunity to work beyond the
                classroom, take on meaningful responsibilities, meet people who
                inspire you, and transform your ideas into action.
              </p>
              <p className="font-semibold text-[#163967] pt-2 border-t border-blue-100/60">
                Join us, grow with us, and unleash your experience as an ALSAian.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
