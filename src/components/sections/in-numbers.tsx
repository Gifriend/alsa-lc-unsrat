"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users2, Trophy } from "lucide-react";

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
      value: stats.alumni > 0 ? `${stats.alumni}+` : "250+",
      desc: "Connected alumni network across legal professions",
      icon: GraduationCap,
    },
    {
      label: "Members",
      value: stats.activeMembers > 0 ? `${stats.activeMembers}+` : "180+",
      desc: "Active law students shaping the future together",
      icon: Users2,
    },
    {
      label: "Achievements",
      value: stats.achievements > 0 ? `${stats.achievements}+` : "45+",
      desc: "National and international recognitions earned",
      icon: Trophy,
    },
  ];

  return (
    <section className="section-spacing container-custom px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl bg-[#163967] text-white p-8 md:p-14 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Our Statistics
          </h2>
          <p className="text-blue-200 text-sm md:text-base font-medium">
            More than numbers, a reflection of our journey
          </p>
        </div>

        {/* 3 Frosted Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-2xl p-6 md:p-8 text-center bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:border-white/40 transition-all flex flex-col items-center justify-between group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-blue-200 mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>

                <div className="font-serif text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                  {isLoading ? "-" : item.value}
                </div>

                <h4 className="font-sans font-bold text-lg text-blue-100 uppercase tracking-wider mb-2">
                  {item.label}
                </h4>

                <p className="text-xs text-blue-200/80 leading-relaxed max-w-[220px]">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
