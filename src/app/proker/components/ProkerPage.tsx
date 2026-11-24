"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Calendar, Filter, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Proker {
  id: string;
  title: string;
  description: string;
  status: "ongoing" | "archived";
  startDate: string;
  division?: string;
}

export default function ProkerPage() {
  const [prokers, setProkers] = useState<Proker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "archived">("all");
  const [selectedDivision, setSelectedDivision] = useState<string>("all");

  const divisions = [
    { id: "all", label: "All Divisions" },
    { id: "internal", label: "Internal Affairs" },
    { id: "external", label: "External Affairs" },
    { id: "finance", label: "Finance Affairs" },
    { id: "aat", label: "Academic & Training (AAT)" },
    { id: "ict", label: "ICT Affairs" },
  ];

  // Default sample programs across 5 divisions
  const defaultPrograms: Proker[] = [
    {
      id: "1",
      title: "ALSA Care & Legal Coaching Clinic",
      description:
        "Community legal consultation and social advocacy outreach organized in surrounding communities.",
      status: "ongoing",
      startDate: "2025-02-15",
      division: "internal",
    },
    {
      id: "2",
      title: "Institutional Law Firm & Court Visit",
      description:
        "External institutional study excursion visiting prestigious law firms and the High Court.",
      status: "ongoing",
      startDate: "2025-03-10",
      division: "external",
    },
    {
      id: "3",
      title: "ALSA Merch Drop & Fundraising Expo",
      description:
        "Official chapter merchandise launching and creative entrepreneurial sponsorship ventures.",
      status: "ongoing",
      startDate: "2025-01-20",
      division: "finance",
    },
    {
      id: "4",
      title: "National Moot Court & Contract Drafting Class",
      description:
        "Intensive legal drafting workshops and moot court simulation training for junior members.",
      status: "ongoing",
      startDate: "2025-02-01",
      division: "aat",
    },
    {
      id: "5",
      title: "Official Website & Digital Archive Overhaul",
      description:
        "Complete revamping of digital presence, search engine indexing, and chapter resources platform.",
      status: "ongoing",
      startDate: "2025-01-05",
      division: "ict",
    },
    {
      id: "6",
      title: "Annual Welcoming Party & Chapter Assembly",
      description:
        "Grand onboarding and orientation conference for newly admitted batch of ALSAian law students.",
      status: "archived",
      startDate: "2024-11-12",
      division: "internal",
    },
  ];

  useEffect(() => {
    const fetchProker = async () => {
      try {
        const response = await fetch("/api/proker");
        if (response.ok) {
          const data = await response.json();
          setProkers(data);
        }
      } catch (error) {
        console.error("Failed to fetch proker:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProker();
  }, []);

  const displayProkers = prokers.length > 0 ? prokers : defaultPrograms;

  const filteredProkers = displayProkers.filter((p) => {
    const matchesStatus =
      statusFilter === "all" ? true : p.status === statusFilter;
    const matchesDivision =
      selectedDivision === "all"
        ? true
        : (p.division || "internal").toLowerCase().includes(selectedDivision);
    return matchesStatus && matchesDivision;
  });

  return (
    <main className="min-h-screen bg-[#f8faff] text-gray-900">
      <Navigation />

      {/* Hero Header Banner */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0e2544] via-[#163967] to-[#1d4880] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/15 via-transparent to-transparent pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
            <span>Activities</span>
            <span>&bull;</span>
            <span>Programs & Events</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
            Programs & Activities
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
            Discover the work programs, academic conferences, and social initiatives
            driven by our five specialized affairs.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing container-custom max-w-6xl">
        {/* Division Filter Tabs */}
        <div className="mb-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-3 text-center sm:text-left">
            Filter by Division / Affairs
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {divisions.map((div) => (
              <button
                key={div.id}
                onClick={() => setSelectedDivision(div.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedDivision === div.id
                    ? "bg-[#163967] text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {div.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Toggle */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200/80">
          <div className="flex items-center gap-2">
            {(["all", "ongoing", "archived"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-blue-100 text-[#163967]"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {status === "all" ? "All Status" : status}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-500 font-medium">
            Showing {filteredProkers.length} program(s)
          </span>
        </div>

        {/* Programs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-blue-50 shadow-[0_4px_25px_rgba(22,57,103,0.04)] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-4/5 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-full rounded-md" />
                  <Skeleton className="h-3.5 w-5/6 rounded-md" />
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Skeleton className="h-3.5 w-28 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProkers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto shadow-sm">
            <p className="font-serif text-lg font-bold text-[#163967] mb-1">
              No programs found
            </p>
            <p className="text-xs text-gray-500">
              Tidak ada program kerja untuk filter yang dipilih saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProkers.map((proker) => (
              <div
                key={proker.id}
                className="bg-white rounded-2xl p-6 border border-blue-50 shadow-[0_4px_25px_rgba(22,57,103,0.04)] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#163967] text-[11px] font-bold uppercase tracking-wider">
                      {proker.division || "General"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                        proker.status === "ongoing"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {proker.status === "ongoing" ? (
                        <Clock size={11} />
                      ) : (
                        <CheckCircle2 size={11} />
                      )}
                      <span>{proker.status}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#163967] mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {proker.title}
                  </h3>

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                    {proker.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-blue-500" />
                    <span>
                      {new Date(proker.startDate).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600">
                    ALSA LC Unsrat
                  </span>
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
