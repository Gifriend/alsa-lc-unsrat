"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, MessageCircle, ThumbsUp, X, Mail } from "lucide-react";

export default function ActivitiesVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="section-spacing container-custom px-4 overflow-hidden">
      <div className="flex flex-col items-center text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#163967] text-white text-xs md:text-sm font-semibold tracking-wide shadow-md mb-8"
        >
          <Sparkles size={16} className="text-yellow-400" />
          <span>Local Chapter Activities</span>
        </motion.div>

        {/* Media Container with Floating 3D Reactions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-3xl"
        >
          {/* Main Activity / Video Card */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
            <Image
              src="/manado.jpg"
              alt="ALSA LC Unsrat Chapter Activities"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
            />
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Play Button Overlay (Facade Pattern) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(true)}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 hover:bg-white text-[#163967] flex items-center justify-center shadow-2xl transition-all"
                aria-label="Play Video Profile"
              >
                <Play size={28} className="fill-[#163967] translate-x-0.5" />
              </motion.button>
              <p className="text-white text-xs md:text-sm font-medium mt-3 drop-shadow">
                Click to Watch Profile Video
              </p>
            </div>
          </div>

          {/* Floating Reaction Bubble: Left (Chat bubble) */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-5 -left-4 md:-left-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-blue-100 flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md">
              <MessageCircle size={20} className="fill-white" />
            </div>
            <div className="flex gap-1 items-center px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-150" />
            </div>
          </motion.div>

          {/* Floating Reaction Bubble: Right (3D Thumbs Up / Like) */}
          <motion.div
            animate={{
              y: [0, -14, 0],
              rotate: [2, -2, 2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute -top-6 -right-3 md:-right-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-blue-100 flex items-center gap-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg">
              <ThumbsUp size={22} className="fill-white" />
            </div>
            <span className="text-xs font-bold text-gray-800 pr-1">
              Always Be One!
            </span>
          </motion.div>
        </motion.div>

        {/* Action Buttons Underneath */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-12"
        >
          <button
            onClick={() => setIsPlaying(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#163967] hover:bg-blue-50 font-bold text-sm shadow-md border border-blue-200 transition-all group"
          >
            <Play size={16} className="fill-[#163967]" />
            <span>Watch Profile</span>
          </button>

          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#163967] text-white hover:bg-[#1a447a] font-bold text-sm shadow-md transition-all group"
          >
            <Mail size={16} />
            <span>Contact Us</span>
          </Link>
        </motion.div>
      </div>

      {/* Video Modal Player (Zero impact before click) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            >
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="aspect-[16/9] w-full">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="ALSA LC Unsrat Profile Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
