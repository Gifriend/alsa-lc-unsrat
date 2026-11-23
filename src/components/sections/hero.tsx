"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms for the hero background & text
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[85vh] md:h-[92vh] min-h-[580px] w-full flex flex-col justify-between items-center overflow-hidden bg-slate-950"
    >
      {/* Parallax Background Building Image */}
      <motion.div
        style={{ y: bgY, scale }}
        className="absolute inset-0 -z-20 will-change-transform"
      >
        <Image
          src="/hukum-unsrat.jpg"
          alt="Gedung Fakultas Hukum Universitas Sam Ratulangi"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-90 contrast-105"
        />
        {/* Soft Vignette and Blue-tint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/30 to-slate-950/80 -z-10" />
      </motion.div>

      {/* Hero Content Center */}
      <motion.div
        style={{ opacity, y: contentY }}
        className="relative z-10 container-custom flex-1 flex flex-col items-center justify-center text-center pt-24 px-4"
      >
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs md:text-sm font-semibold tracking-wide shadow-lg mb-6 transition-all"
        >
          <Sparkles size={16} className="text-yellow-300 animate-pulse" />
          <span>Start with the ALSA Life</span>
        </motion.div>

        {/* Catchphrase */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/90 text-sm md:text-lg max-w-xl font-medium drop-shadow-md mb-4"
        >
          Connect The Difference, Together We Develop. ALSA, Always Be One!
        </motion.p>
      </motion.div>

      {/* Bottom Faceted Ribbon Badge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-20 w-full max-w-2xl px-4 pb-4 md:pb-6"
      >
        <div className="hero-ribbon-badge bg-[#163967]/95 backdrop-blur-md border border-white/20 text-white text-center py-5 px-6 md:px-10 shadow-2xl rounded-t-xl">
          <h1 className="font-sans text-xl md:text-3xl font-extrabold uppercase tracking-wider text-white drop-shadow">
            ALSA LOCAL CHAPTER
          </h1>
          <p className="font-sans text-sm md:text-lg font-bold tracking-widest text-blue-200 uppercase mt-0.5">
            UNIVERSITAS SAM RATULANGI
          </p>
        </div>
      </motion.div>

      {/* Subtle Scroll Down Prompt Indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50 hidden md:flex items-center gap-1 text-xs"
      >
        <ArrowDown size={14} />
      </motion.div>
    </section>
  );
}
