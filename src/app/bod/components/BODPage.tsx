"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Users, Award, Shield, Layers, History, User } from "lucide-react";

interface BODMember {
  id: string;
  name: string;
  position: string;
  image?: string;
  level: number;
  order: number;
  division?: string;
}

export default function BODPage() {
  const [members, setMembers] = useState<BODMember[]>([]);
  const [term, setTerm] = useState("2024-2025");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "bod" | "affairs" | "history">("all");

  useEffect(() => {
    const fetchBOD = async () => {
      try {
        const response = await fetch("/api/bod");
        if (response.ok) {
          const data = await response.json();
          setMembers(data.members || []);
          setTerm(data.term || "2024-2025");
        }
      } catch (error) {
        console.error("Failed to fetch BOD:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBOD();
  }, []);

  // Standard Affairs structure for ALSA LC Unsrat as specified in requirements
  const affairsList = [
    {
      id: "internal",
      name: "Internal Affairs",
      desc: "Managing internal cohesion, member development, and organizational harmony.",
    },
    {
      id: "external",
      name: "External Affairs",
      desc: "Fostering institutional partnerships, alumni network, and public relations.",
    },
    {
      id: "finance",
      name: "Finance Affairs",
      desc: "Directing treasury, budgeting, fundraising, and merchandise ventures.",
    },
    {
      id: "aat",
      name: "Academic & Activities Training",
      desc: "Organizing legal workshops, moot court simulations, and scholastic research.",
    },
    {
      id: "ict",
      name: "Information & Communication Technology",
      desc: "Managing digital platforms, creative branding, website, and technical systems.",
    },
  ];

  // Leadership History sample records
  const leadershipHistory = [
    {
      term: "2024 - 2025",
      director: "Nathania E. Kembuan",
      theme: "Catalyst of Collaboration & Legal Excellence",
    },
    {
      term: "2023 - 2024",
      director: "Previous Director",
      theme: "Strengthening Foundation & Regional Engagement",
    },
    {
      term: "2022 - 2023",
      director: "Previous Director",
      theme: "Digital Resilience & Academic Leadership",
    },
  ];

  // Group members by level
  const groupedMembers = members.reduce(
    (acc, member) => {
      const level = member.level || 1;
      if (!acc[level]) acc[level] = [];
      acc[level].push(member);
      return acc;
    },
    {} as Record<number, BODMember[]>,
  );

  Object.keys(groupedMembers).forEach((level) => {
    groupedMembers[Number(level)].sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );
  });

  const levels = Object.keys(groupedMembers)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <main className="min-h-screen bg-[#f8faff] text-gray-900">
      <Navigation />

      {/* Hero Header Banner */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0e2544] via-[#163967] to-[#1d4880] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/15 via-transparent to-transparent pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
            <span>Leadership</span>
            <span>&bull;</span>
            <span>Term {term}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
            Board & Bagan Kepengurusan
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
            The Board of Directors and Division Officers of ALSA Local Chapter
            Universitas Sam Ratulangi driving vision, leadership, and operational
            excellence.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="section-spacing container-custom max-w-6xl">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#163967] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Layers size={14} />
            <span>All Structure</span>
          </button>

          <button
            onClick={() => setActiveTab("bod")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "bod"
                ? "bg-[#163967] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Shield size={14} />
            <span>Board of Directors (BOD)</span>
          </button>

          <button
            onClick={() => setActiveTab("affairs")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "affairs"
                ? "bg-[#163967] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Users size={14} />
            <span>Per Affairs (Divisi)</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-[#163967] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <History size={14} />
            <span>Leadership History</span>
          </button>
        </div>

        {/* 1. All Structure / BOD Organogram */}
        {(activeTab === "all" || activeTab === "bod") && (
          <div className="mb-16">
            <div className="text-center mb-10">
              <span className="text-xs uppercase font-bold tracking-widest text-blue-600 block mb-1">
                Executive Structure
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#163967]">
                Board of Directors ({term})
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-16 text-gray-500">
                Loading board members...
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-8 max-w-md mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#163967] flex items-center justify-center mx-auto mb-4">
                  <User size={32} />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#163967] mb-1">
                  BOD Structure in Preparation
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Struktur kepengurusan sedang disiapkan dan dapat diperbarui
                  melalui panel admin.
                </p>
              </div>
            ) : (
              <div className="org-chart flex flex-col items-center">
                {levels.map((level, levelIndex) => (
                  <div key={level} className="w-full flex flex-col items-center">
                    {/* Level Row */}
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8">
                      {groupedMembers[level].map((member) => (
                        <div
                          key={member.id}
                          className="flex flex-col items-center group"
                        >
                          {/* Connector line from top */}
                          {levelIndex > 0 && (
                            <div className="w-0.5 h-6 bg-blue-200 mb-2" />
                          )}

                          {/* Avatar Circle with Placeholder fallback */}
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-[#163967] bg-white shadow-lg group-hover:scale-105 transition-transform">
                            {member.image ? (
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-100 to-blue-50 text-blue-300">
                                <User size={40} />
                              </div>
                            )}
                          </div>

                          {/* Member Info Card */}
                          <div className="text-center mt-3 max-w-[180px] bg-white rounded-xl p-2.5 shadow-sm border border-blue-50">
                            <p className="text-blue-600 text-[11px] sm:text-xs font-bold uppercase tracking-wider leading-tight">
                              {member.position}
                            </p>
                            <p className="text-gray-900 text-xs sm:text-sm font-bold mt-0.5 leading-snug">
                              {member.name}
                            </p>
                          </div>

                          {/* Connector line to bottom */}
                          {levelIndex < levels.length - 1 && (
                            <div className="w-0.5 h-6 bg-blue-200 mt-4" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Horizontal Connector Line */}
                    {levelIndex < levels.length - 1 &&
                      groupedMembers[level].length > 1 && (
                        <div className="w-1/2 max-w-md h-0.5 bg-blue-200 mb-2" />
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Bagan Kepengurusan Per Affairs (Divisi) */}
        {(activeTab === "all" || activeTab === "affairs") && (
          <div className="mb-16">
            <div className="text-center mb-10">
              <span className="text-xs uppercase font-bold tracking-widest text-blue-600 block mb-1">
                Departmental Focus
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#163967]">
                Bagan Kepengurusan Per Affairs
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Lima pilar operasional pengurus ALSA LC UNSRAT.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {affairsList.map((affair) => (
                <div
                  key={affair.id}
                  className="bg-white rounded-2xl p-6 border border-blue-50 shadow-[0_4px_25px_rgba(22,57,103,0.04)] hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#163967] flex items-center justify-center font-bold text-xs mb-3">
                      {affair.id.toUpperCase()}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#163967] mb-2">
                      {affair.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {affair.desc}
                    </p>
                  </div>

                  {/* Officer Placeholders */}
                  <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center text-gray-400">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        Officer / Manager
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Photo & bio configured via Admin
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Leadership History */}
        {(activeTab === "all" || activeTab === "history") && (
          <div>
            <div className="text-center mb-10">
              <span className="text-xs uppercase font-bold tracking-widest text-blue-600 block mb-1">
                Legacy of Directors
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#163967]">
                Leadership History
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {leadershipHistory.map((item, index) => (
                <div
                  key={item.term}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#163967] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      0{index + 1}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-600 block mb-0.5">
                        Term {item.term}
                      </span>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-[#163967]">
                        {item.director}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.theme}
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-center px-3 py-1 rounded-full bg-blue-50 text-[#163967] text-xs font-semibold">
                    Local Director
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}