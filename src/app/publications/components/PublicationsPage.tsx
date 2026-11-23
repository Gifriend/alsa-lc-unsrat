"use client";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface Publication {
  id: string;
  title: string;
  year: number;
  authors: string;
  pdf_url: string; // Ubah ke pdf_url agar sesuai dengan data dari API
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch("/api/publications");
        if (response.ok) {
          const data = await response.json();
          setPublications(data);
        }
      } catch (error) {
        console.error("Failed to fetch publications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const years = Array.from(new Set(publications.map((p) => p.year))).sort(
    (a, b) => b - a
  );
  const filteredPublications =
    selectedYear === "all"
      ? publications
      : publications.filter((p) => p.year === selectedYear);

  return (
    <main className="min-h-screen bg-[#f8faff] text-gray-900 flex flex-col justify-between">
      <div>
        <Navigation />

        {/* Hero Header Banner */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0e2544] via-[#163967] to-[#1d4880] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/15 via-transparent to-transparent pointer-events-none" />
          <div className="container-custom relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
              <span>Publications</span>
              <span>&bull;</span>
              <span>Scholarly Work</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
              Publications & Legal Articles
            </h1>
            <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Kumpulan artikel hukum, jurnal ilmiah, dan rilis publikasi resmi dari
              anggota dan pengurus ALSA Local Chapter Universitas Sam Ratulangi.
            </p>
          </div>
        </section>

        <section className="section-spacing container-custom max-w-6xl py-14">
        {!isLoading && years.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedYear("all")}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                selectedYear === "all"
                  ? "bg-accent text-white"
                  : "bg-neutral-light hover:bg-primary hover:text-white"
              }`}
            >
              All Years
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded font-semibold transition-colors ${
                  selectedYear === year
                    ? "bg-accent text-white"
                    : "bg-neutral-light hover:bg-primary hover:text-white"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">Loading publications...</div>
        ) : filteredPublications.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">
            No publications found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPublications.map((pub) => (
              <div
                key={pub.id}
                className="bg-white border border-ring rounded p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold text-primary mb-1">
                      {pub.title}
                    </h3>
                    <p className="text-neutral-medium text-sm mb-2">
                      {pub.authors}
                    </p>{" "}
                    {/* Hilangkan .join, karena sekarang string */}
                    <p className="text-accent text-sm font-semibold">
                      {pub.year}
                    </p>
                  </div>
                  {pub.pdf_url ? (
                    <a
                      href={pub.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-accent hover:bg-accent-light text-white rounded transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Download size={18} />
                      <span className="hidden sm:inline">View PDF</span>
                    </a>
                  ) : (
                    <span className="p-3 bg-gray-300 text-gray-600 rounded flex items-center gap-2 whitespace-nowrap">
                      No PDF
                    </span>
                  )}
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
