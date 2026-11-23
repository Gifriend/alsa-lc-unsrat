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
      desc: "Promoting cross-border dialogue and global awareness.",
    },
    {
      title: "Socially Responsible",
      icon: Handshake,
      desc: "Advancing social justice and community contribution.",
    },
    {
      title: "Legally Skilled",
      icon: Scale,
      desc: "Honing legal proficiency and practical capability.",
    },
    {
      title: "Academically Committed",
      icon: BookOpen,
      desc: "Fostering rigorous research and legal scholarship.",
    },
  ];

  return (
    <section className="section-spacing container-custom px-4 overflow-hidden">
      {/* Intro Split: Title + Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#163967] mb-6 leading-tight">
            What is ALSA?
          </h2>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#163967] hover:bg-[#1f4c87] text-white font-semibold text-sm shadow-md transition-all group"
          >
            <span>Explore More</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            <span className="font-bold text-[#163967]">
              ALSA (Asian Law Students&apos; Association)
            </span>{" "}
            is an{" "}
            <span className="font-bold text-[#163967]">
              international organization that connects law students across Asia
            </span>
            . It provides opportunities to{" "}
            <span className="font-bold text-[#163967]">
              develop legal knowledge, leadership, professional skills, and
              international networks
            </span>{" "}
            through various academic, cultural, and social activities.
          </p>
        </motion.div>
      </div>

      {/* Pillars & Vision/Mission Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 4 Pillars 2x2 Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#163967] flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-serif font-bold text-[#163967] text-lg mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                  <span>Pillar 0{index + 1}</span>
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Right: Vision & Mission Solid Blue Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex flex-col gap-4 justify-between"
        >
          {/* Vision Card */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex-1 p-6 md:p-8 rounded-2xl bg-[#163967] text-white shadow-xl flex flex-col justify-between border border-blue-900/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 text-blue-200">
                <Eye size={26} />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-blue-300 block mb-2">
                Vision
              </span>
              <p className="font-serif text-lg md:text-xl font-bold leading-snug">
                To be the leading international organization for law students in
                Asia.
              </p>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex-1 p-6 md:p-8 rounded-2xl bg-[#1a447a] text-white shadow-xl flex flex-col justify-between border border-blue-900/50 relative overflow-hidden"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mb-10" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 text-blue-200">
                <Target size={26} />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-blue-300 block mb-2">
                Mission
              </span>
              <p className="font-serif text-lg md:text-xl font-bold leading-snug">
                To develop law students beyond borders.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
