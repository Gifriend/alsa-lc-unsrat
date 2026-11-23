"use client";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Founder {
  id: string;
  name: string;
  period: string;
  description: string;
  image?: string;
}

export default function FoundersPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const response = await fetch("/api/founders");
        if (response.ok) {
          const data = await response.json();
          setFounders(data);
        }
      } catch (error) {
        console.error("Failed to fetch founders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFounders();
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
              <span>Alumni</span>
              <span>&bull;</span>
              <span>Our Pioneers</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
              Founding Fathers & Mothers
            </h1>
            <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Mengenal para perintis dan pendiri ALSA Local Chapter Universitas Sam
              Ratulangi yang meletakkan fondasi keunggulan kepemimpinan hukum.
            </p>
          </div>
        </section>

        <section className="section-spacing container-custom max-w-6xl py-14">
          {isLoading ? (
            <div className="text-center py-16 text-gray-500">Loading founders...</div>
          ) : founders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto shadow-sm">
              <p className="font-serif text-lg font-bold text-[#163967] mb-1">
                Data Founders
              </p>
              <p className="text-xs text-gray-500">
                Profil perintis dan pendiri sedang dimutakhirkan melalui panel admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {founders.map((founder) => (
              <div
                key={founder.id}
                className="bg-white rounded shadow hover:shadow-lg transition-shadow"
              >
                {founder.image && (
                  <div className="h-48 bg-neutral-light flex items-center justify-center text-4xl">
                    📷
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-primary mb-2">
                    {founder.name}
                  </h3>
                  <p className="text-accent font-semibold text-sm mb-3">
                    {founder.period}
                  </p>
                  <p className="text-neutral-medium text-sm">
                    {founder.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
