"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe2,
  Handshake,
  Scale,
  BookOpen,
  Eye,
  Target,
  ArrowRight,
} from "lucide-react";

export default function WhatIsAlsa() {
  const pillars = [
    {
      title: "Internationally Minded",
      icon: Globe2,
    },
    {
      title: "Socially Responsible",
      icon: Handshake,
    },
    {
      title: "Legally Skilled",
      icon: Scale,
    },
    {
      title: "Academically Committed",
      icon: BookOpen,
    },
  ];

  return (
    <section className="section-spacing container-custom px-4 overflow-hidden max-w-5xl mx-auto">
      {/* Intro Split: Title & Button on Left + Explanatory Text on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="md:col-span-5"
        >
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#163967] mb-4 tracking-tight">
            What is ALSA?
          </h2>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#163967] hover:bg-[#112d52] text-white font-semibold text-xs sm:text-sm shadow-md transition-all group"
          >
            <span>Explore More</span>
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="md:col-span-7"
        >
          <p className="text-gray-700 text-xs sm:text-sm md:text-[15px] leading-relaxed">
            <span className="font-bold text-[#163967]">
              ALSA (Asian Law Students&apos; Association)
            </span>{" "}
            is an{" "}
            <span className="font-semibold text-[#163967]">
              international organization that connects law students across Asia
            </span>
            . It provides opportunities to{" "}
            <span className="font-semibold text-[#163967]">
              develop legal knowledge, leadership, professional skills, and
              international networks
            </span>{" "}
            through various academic, cultural, and social activities.
          </p>
        </motion.div>
      </div>

      {/* 3 Cards in a Single Row (Pillars 2x2, Vision, Mission) matching mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: 4 Pillars in a 2x2 layout inside light frosted glass card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 rounded-2xl p-6 sm:p-7 bg-white/70 backdrop-blur-md border border-white/90 shadow-[0_4px_25px_rgba(22,57,103,0.04)] flex flex-col justify-between"
        >
          <div className="grid grid-cols-2 gap-y-7 gap-x-4 h-full items-center">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="flex flex-col items-center text-center p-2 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-[#163967] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <span className="font-sans font-bold text-xs sm:text-sm text-[#163967] leading-snug">
                    {pillar.title}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Card 2: Vision Card in Solid Deep Blue */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-3 rounded-2xl p-6 sm:p-7 bg-[#163967] text-white shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
            <Eye size={24} />
          </div>
          <p className="font-sans font-medium text-xs sm:text-sm leading-relaxed text-blue-50">
            To be the leading international organization for law students in
            Asia.
          </p>
        </motion.div>

        {/* Card 3: Mission Card in Solid Deep Blue */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="lg:col-span-3 rounded-2xl p-6 sm:p-7 bg-[#163967] text-white shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
            <Target size={24} />
          </div>
          <p className="font-sans font-medium text-xs sm:text-sm leading-relaxed text-blue-50">
            To develop law students beyond borders.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
