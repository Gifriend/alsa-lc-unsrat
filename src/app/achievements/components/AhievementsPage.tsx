"use client";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch("/api/achievements");
        if (response.ok) {
          const data = await response.json();
          setAchievements(data);
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8faff] text-gray-900 flex flex-col justify-between">
      <div>
        <Navigation />

        {/* Hero Header Banner */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0e2544] via-[#163967] to-[#1d4880] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/15 via-transparent to-transparent pointer-events-none" />
          <div className="container-custom relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
              <span>Excellence</span>
              <span>&bull;</span>
              <span>Honors & Trophies</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
              Achievements & Recognitions
            </h1>
            <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Daftar prestasi dan penghargaan tingkat regional, nasional, dan
              internasional yang diraih oleh ALSA LC UNSRAT.
            </p>
          </div>
        </section>

        <section className="section-spacing container-custom max-w-6xl py-14">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Skeleton Loading sederhana */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg h-80 animate-pulse"
              ></div>
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">
            No achievements found yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement) => (
              <Link
                href={`/achievements/${achievement.id}`}
                key={achievement.id}
                className="group block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Bagian Gambar / Placeholder */}
                <div className="h-48 w-full bg-gray-50 relative overflow-hidden flex items-center justify-center">
                  {achievement.imageUrl ? (
                    <img
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    // PLACEHOLDER STYLE (SHADCN-LIKE)
                    <div className="flex flex-col items-center justify-center text-gray-300">
                      <ImageIcon size={48} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Bagian Konten */}
                <div className="p-6 bg-primary">
                  <h3 className="font-serif text-xl font-bold text-background mb-2 line-clamp-1">
                    {achievement.title}
                  </h3>
                  <p className="text-background mb-3 line-clamp-2 text-sm">
                    {achievement.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-background text-xs font-semibold px-2 py-1 bg-accent/10 rounded">
                      {new Date(achievement.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-background text-sm font-medium group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      </div>
      <Footer />
    </main>
  );
}
