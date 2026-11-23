"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[600px] md:min-h-[700px] h-[85vh] w-full flex flex-col justify-between items-center overflow-hidden"
    >
      {/* Hero Background Image */}
      <motion.div
        style={{ y: bgY, scale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <Image
          src="/hukum-unsrat.jpg"
          alt="Gedung Rektorat & Fakultas Hukum Universitas Sam Ratulangi"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.85]"
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none" />
      </motion.div>

      {/* Decorative Dome / Arch Contour (As seen in mockup) */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[620px] md:h-[620px] rounded-full border border-white/20 bg-white/5 backdrop-blur-[0.5px] pointer-events-none z-[2]" />

      {/* Hero Center Content: Pill Button */}
      <motion.div
        style={{ opacity, y: contentY }}
        className="relative z-10 container-custom flex-1 flex flex-col items-center justify-center text-center pt-24 px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white text-gray-900 text-xs md:text-sm font-semibold shadow-2xl hover:bg-gray-100 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center">
            <Play size={10} className="fill-white translate-x-0.5" />
          </div>
          <span>Start with the ALSA life</span>
        </motion.div>
      </motion.div>

      {/* 
        Bottom Recessed Trapezoid Section Header:
        Matches the exact mockup shape where the text sits in a lower notch 
        flanked by the white shoulders of the content sheet.
      */}
      <div className="relative z-20 w-full flex flex-col items-center justify-end">
        {/* Title sitting inside the notch */}
        <div className="absolute bottom-2 md:bottom-3 z-30 text-center px-4 max-w-xl mx-auto pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-sans text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            ALSA LOCAL CHAPTER
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-sans text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-widest text-blue-100 uppercase mt-0.5 md:mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
          >
            UNIVERSITAS SAM RATULANGI
          </motion.p>
        </div>

        {/* Notch Shape SVG Transition to White Section */}
        <div className="w-full overflow-hidden leading-none -mb-px">
          <svg
            viewBox="0 0 1200 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-14 sm:h-18 md:h-24 lg:h-28 block"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 0 H 260 C 280 0 295 10 315 35 L 340 70 C 350 84 368 90 388 90 H 812 C 832 90 850 84 860 70 L 885 35 C 905 10 920 0 940 0 H 1200 V 90 H 0 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
