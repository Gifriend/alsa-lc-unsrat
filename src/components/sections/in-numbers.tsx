"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Stats {
  activeMembers: number;
  alumni: number;
  totalMembers: number;
  programs: number;
  achievements: number;
}

export default function InNumbers() {
  const [stats, setStats] = useState<Stats>({
    activeMembers: 0,
    alumni: 0,
    totalMembers: 0,
    programs: 0,
    achievements: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      label: "Alumni",
      value: stats.alumni > 0 ? `${stats.alumni}+` : "999+",
    },
    {
      label: "Members",
      value: stats.activeMembers > 0 ? `${stats.activeMembers}+` : "999+",
    },
    {
      label: "Achievements",
      value: stats.achievements > 0 ? `${stats.achievements}+` : "999+",
    },
  ];

  return (
    <section className="section-spacing container-custom px-4 overflow-visible max-w-5xl mx-auto mb-16">
      {/* Blue Banner Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl bg-[#163967] text-white pt-10 pb-20 sm:pb-24 px-6 text-center shadow-xl relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            Our Statistics
          </h2>
          <p className="font-sans text-xs sm:text-sm text-blue-100 font-normal">
            More than numbers, a reflection of our journey
          </p>
        </div>
      </motion.div>

      {/* 3 Overhanging Stat Cards matching mockup */}
      <div className="relative -mt-14 sm:-mt-16 max-w-4xl mx-auto px-4 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(22,57,103,0.15)] border border-white/70 backdrop-blur-xl flex flex-col group cursor-default"
            >
              {/* Top half: inside the blue box */}
              <div className="pt-6 pb-4 px-4 bg-[#1b437a]/85 backdrop-blur-md flex flex-col items-center justify-center transition-colors group-hover:bg-[#1f4c87]/90">
                <span className="font-sans text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {isLoading ? "-" : item.value}
                </span>
              </div>

              {/* Bottom half: overhanging into the light background */}
              <div className="py-3 px-4 bg-white/90 backdrop-blur-md border-t border-white/40 flex items-center justify-center">
                <span className="font-sans font-bold text-xs sm:text-sm text-[#163967] tracking-wider uppercase">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
