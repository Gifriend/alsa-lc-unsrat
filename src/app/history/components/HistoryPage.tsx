"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ExternalLink, MapPin, Building2, Calendar, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface HistoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export default function HistoryPage() {
  const [timeline, setTimeline] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        const data = await response.json();
        setTimeline(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback timeline milestones if database is empty
  const defaultMilestones: HistoryItem[] = [
    {
      id: "1",
      year: "2000",
      title: "Establishment of ALSA LC UNSRAT",
      description:
        "ALSA Local Chapter Universitas Sam Ratulangi was officially founded as part of ALSA National Chapter Indonesia, bringing law students in Manado into an international network.",
    },
    {
      id: "2",
      year: "2010",
      title: "National & Regional Engagement",
      description:
        "Expanded active participation in national seminars, moot court competitions, and student exchanges across Asian law faculties.",
    },
    {
      id: "3",
      year: "2020",
      title: "Digital Transformation & Resilience",
      description:
        "Pioneered online legal workshops, virtual academic discussions, and cross-border webinars during the global pandemic.",
    },
    {
      id: "4",
      year: "2024",
      title: "Empowering Future Legal Leaders",
      description:
        "Continuing a legacy of excellence through leadership development, professional legal skill training, and community service.",
    },
  ];

  const displayTimeline = timeline.length > 0 ? timeline : defaultMilestones;

  return (
    <main className="min-h-screen bg-[#f8faff] text-gray-900">
      <Navigation />

      {/* Hero Header Banner */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0e2544] via-[#163967] to-[#1d4880] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/15 via-transparent to-transparent pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
            <span>About Us</span>
            <span>&bull;</span>
            <span>Our Heritage</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
            History of ALSA
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
            The journey and milestone of ALSA Indonesia and ALSA Local Chapter
            Universitas Sam Ratulangi in shaping internationally minded, legally
            skilled law students.
          </p>
        </div>
      </section>

      {/* 1. History of ALSA Indonesia Section */}
      <section className="section-spacing container-custom max-w-5xl">
        <div className="glass-card rounded-3xl p-6 sm:p-10 bg-white/80 backdrop-blur-md border border-white shadow-[0_10px_35px_rgba(22,57,103,0.05)] mb-14">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                <Award size={16} />
                <span>National Heritage</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#163967] mb-4">
                History of ALSA Indonesia
              </h2>
              <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed mb-4">
                ALSA (Asian Law Students&apos; Association) National Chapter
                Indonesia was established to unite Indonesian law students across
                leading universities. It serves as an institutional bridge
                connecting local talents with regional and global legal
                jurisdictions across Asian countries.
              </p>
              <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed">
                Under the core pillars of being Internationally Minded, Socially
                Responsible, Legally Skilled, and Academically Committed, ALSA
                Indonesia organizes flagship events, national assemblies, and
                advocacy initiatives.
              </p>
            </div>

            {/* National Chapter External Link Card */}
            <div className="w-full md:w-80 shrink-0 p-6 rounded-2xl bg-gradient-to-br from-[#163967] to-[#1f4c87] text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs text-blue-200 uppercase tracking-wider font-semibold block mb-2">
                  Official Portal
                </span>
                <h4 className="font-serif text-lg font-bold text-white mb-2">
                  ALSA National Chapter Indonesia
                </h4>
                <p className="text-xs text-blue-100 leading-relaxed mb-6">
                  Visit the national portal for national assemblies, chapter
                  directories, and nation-wide legal activities.
                </p>
              </div>
              <a
                href="https://alsaindonesia.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#163967] hover:bg-blue-50 text-xs font-bold transition-all shadow-md group"
              >
                <span>Visit National Website</span>
                <ExternalLink
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>

        {/* 2. History of ALSA LC UNSRAT with Numbered Steppers */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-600 block mb-2">
              Timeline Milestones
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#163967]">
              History of ALSA LC UNSRAT
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              Chronological milestones of our chapter&apos;s growth and
              achievements.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="relative pl-4 sm:pl-8 space-y-8">
                <div className="absolute left-[27px] sm:left-[43px] top-6 bottom-6 w-0.5 bg-slate-200" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 sm:gap-6 relative">
                    <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0 z-10" />
                    <div className="flex-1 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-3">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-3/5 rounded-md" />
                      <Skeleton className="h-3.5 w-full rounded-md" />
                      <Skeleton className="h-3.5 w-4/5 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative pl-4 sm:pl-8">
                {/* Vertical connecting line */}
                <div className="absolute left-[27px] sm:left-[43px] top-6 bottom-6 w-0.5 bg-blue-200" />

                {displayTimeline.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 sm:gap-6 mb-10 relative group"
                  >
                    {/* Stepper with NUMBERS (as instructed by user) */}
                    <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#163967] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md border-3 border-white shrink-0 group-hover:scale-110 transition-transform">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Timeline Content Card */}
                    <div className="flex-1 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(22,57,103,0.04)] border border-blue-50 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#163967] text-xs font-bold">
                          <Calendar size={12} />
                          <span>{item.year}</span>
                        </span>
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#163967] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Lokasi Fakultas Hukum UNSRAT */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/80 backdrop-blur-md border border-white shadow-[0_10px_35px_rgba(22,57,103,0.05)]">
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#163967] flex items-center justify-center shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                  Location & Secretariat
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#163967] mb-1">
                  Fakultas Hukum Universitas Sam Ratulangi
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed flex items-center gap-1.5 mt-1">
                  <MapPin size={14} className="text-red-500 shrink-0" />
                  <span>
                    Jl. Kampus Unsrat, Bahu, Kec. Malalayang, Kota Manado,
                    Sulawesi Utara 95115
                  </span>
                </p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Fakultas+Hukum+Universitas+Sam+Ratulangi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#163967] hover:bg-[#112d52] text-white text-xs sm:text-sm font-semibold transition-all shrink-0 shadow-md group"
            >
              <span>View on Maps</span>
              <ExternalLink size={14} className="group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}