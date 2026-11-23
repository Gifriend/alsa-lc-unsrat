"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms for the hero background image & content
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[85vh] md:h-[92vh] min-h-[580px] w-full flex flex-col justify-between items-center overflow-hidden"
    >
      {/* 
        Hero Background Image:
        Uses the original /hukum-unsrat.jpg building photo used previously.
        Placed at z-0 with positive stacking context so it is clearly visible.
      */}
      <motion.div
        style={{ y: bgY, scale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <Image
          src="/hukum-unsrat.jpg"
          alt="Gedung Fakultas Hukum Universitas Sam Ratulangi"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Clean dark gradient overlay for optimal text contrast without muddying the photo */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/30 to-black/75 pointer-events-none" />
      </motion.div>

      {/* Hero Content Center */}
      <motion.div
        style={{ opacity, y: contentY }}
        className="relative z-10 container-custom flex-1 flex flex-col items-center justify-center text-center pt-24 px-4"
      >
        {/* Clean Pill Badge without any emojis */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs md:text-sm font-medium tracking-wide shadow-lg mb-6 transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-blue-300" />
          <span>Start with the ALSA Life</span>
        </motion.div>

        {/* Catchphrase */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/95 text-sm md:text-lg max-w-xl font-medium drop-shadow mb-4"
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

      {/* Subtle Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50 hidden md:flex items-center gap-1 text-xs z-10"
      >
        <ArrowDown size={14} />
      </motion.div>
    </section>
  );
}
