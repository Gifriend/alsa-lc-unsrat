"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const scrollToContent = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: window.innerHeight * 0.78,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[620px] md:min-h-[720px] h-[86vh] w-full flex flex-col justify-between items-center overflow-hidden"
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

      {/* 
        Hero Content Area:
        Positioned "agak kebawah" (lower down, right above the notch)
        with decorative concentric circles ("bulat-bulat") centered directly around the button.
      */}
      <motion.div
        style={{ opacity, y: contentY }}
        className="relative z-10 container-custom flex-1 flex flex-col items-center justify-end pb-8 sm:pb-10 md:pb-14 text-center px-4"
      >
        <div className="relative inline-flex items-center justify-center">
          {/* 
            Decorative Concentric Circles ("Bulat-bulat"):
            Positioned directly around the button ("disekitar tombol").
            Appears and smoothly radiates/glows when hovering "Step into the ALSA side".
          */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
            {/* Outer ambient ring */}
            <motion.div
              animate={{
                opacity: isHovered ? 0.45 : 0.08,
                scale: isHovered ? 1.1 : 0.92,
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] rounded-full border border-white/20 bg-white/[0.02] -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 blur-[1px]"
            />

            {/* Mid contour ring */}
            <motion.div
              animate={{
                opacity: isHovered ? 0.8 : 0.16,
                scale: isHovered ? 1.05 : 0.96,
                borderColor: isHovered
                  ? "rgba(255, 255, 255, 0.45)"
                  : "rgba(255, 255, 255, 0.15)",
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-[230px] h-[230px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] rounded-full border border-white/25 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent backdrop-blur-[1px] -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 shadow-[0_0_35px_rgba(255,255,255,0.08)]"
            />

            {/* Inner close halo ring */}
            <motion.div
              animate={{
                opacity: isHovered ? 0.95 : 0.22,
                scale: isHovered ? 1.02 : 0.98,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-[160px] h-[160px] sm:w-[210px] sm:h-[210px] md:w-[240px] md:h-[240px] rounded-full border border-blue-200/40 bg-blue-300/[0.04] -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2"
            />
          </div>

          {/* Button */}
          <motion.button
            onClick={scrollToContent}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 group inline-flex items-center gap-3 px-6 py-2.5 sm:py-3 rounded-full bg-white text-gray-900 text-xs sm:text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-gray-50 hover:shadow-[0_15px_40px_rgba(255,255,255,0.25)] transition-all cursor-pointer border border-white/60"
          >
            <div className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
              <ArrowDownRight size={12} className="stroke-[2.5]" />
            </div>
            <span className="tracking-wide">Step into the ALSA side</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 
        Bottom Recessed Trapezoid Section Header:
        Matches the exact mockup shape where the text sits in a lower notch 
        flanked by the white shoulders of the content sheet.
      */}
      <div className="relative z-20 w-full flex flex-col items-center justify-end">
        {/* Soft Blue Atmospheric Ambient Glow inside the Notch behind Text */}
        <div className="absolute bottom-0 inset-x-0 h-32 flex items-center justify-center pointer-events-none z-25 overflow-hidden">
          <div className="w-80 sm:w-[500px] md:w-[700px] h-20 sm:h-28 bg-gradient-to-t from-blue-500/25 via-blue-400/15 to-transparent blur-2xl rounded-full" />
        </div>

        {/* Title sitting inside the notch */}
        <div className="absolute bottom-2.5 sm:bottom-3 md:bottom-4 z-30 text-center px-2 sm:px-4 max-w-xl mx-auto pointer-events-none w-full">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-sans text-xs sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-extrabold uppercase tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-tight"
          >
            ALSA LOCAL CHAPTER
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-sans text-[10px] sm:text-xs md:text-sm lg:text-base font-bold tracking-widest text-blue-100 uppercase mt-0.5 md:mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] leading-tight"
          >
            UNIVERSITAS SAM RATULANGI
          </motion.p>
        </div>

        {/* Notch Shape SVG Transition to White/Ice-Blue Section */}
        <div className="w-full overflow-hidden leading-none -mb-px relative">
          {/* Mobile Notch: Narrow white shoulders and extra-wide opening with soft ice-blue gradient */}
          <svg
            viewBox="0 0 1200 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-16 block sm:hidden"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="heroNotchMobileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e8f2fe" />
                <stop offset="40%" stopColor="#f4f8fe" />
                <stop offset="100%" stopColor="#f5f9ff" />
              </linearGradient>
            </defs>
            <path
              d="M 0 0 H 40 C 60 0 75 10 95 35 L 115 65 C 125 80 135 90 155 90 H 1045 C 1065 90 1075 80 1085 65 L 1105 35 C 1125 10 1140 0 1160 0 H 1200 V 90 H 0 Z"
              fill="url(#heroNotchMobileGrad)"
            />
          </svg>

          {/* Tablet & Desktop Notch: Classic proportional shoulders with ice-blue gradient and luminous contour edge */}
          <svg
            viewBox="0 0 1200 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-18 md:h-24 lg:h-28 hidden sm:block"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="heroNotchDesktopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e4f0fc" />
                <stop offset="35%" stopColor="#f2f7fe" />
                <stop offset="100%" stopColor="#f5f9ff" />
              </linearGradient>
              <linearGradient id="heroNotchEdge" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.4" />
                <stop offset="25%" stopColor="#bfdbfe" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="75%" stopColor="#bfdbfe" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path
              d="M 0 0 H 260 C 280 0 295 10 315 35 L 340 70 C 350 84 368 90 388 90 H 812 C 832 90 850 84 860 70 L 885 35 C 905 10 920 0 940 0 H 1200 V 90 H 0 Z"
              fill="url(#heroNotchDesktopGrad)"
            />
            <path
              d="M 0 0 H 260 C 280 0 295 10 315 35 L 340 70 C 350 84 368 90 388 90 H 812 C 832 90 850 84 860 70 L 885 35 C 905 10 920 0 940 0 H 1200"
              stroke="url(#heroNotchEdge)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
