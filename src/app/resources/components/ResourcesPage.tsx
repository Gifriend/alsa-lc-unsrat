"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Download, FileText, Shield, BookOpen, FileCheck2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ResourceFile {
  id: string;
  resource_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

interface Resource {
  id: string;
  name: string;
  description: string;
  file_url: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
  category: string;
  resource_files: ResourceFile[];
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Official statutory documents required by ALSA LC Unsrat
  const officialLegalDocs = [
    {
      title: "GBHK ALSA LC UNSRAT",
      fullName: "Garis-Garis Besar Haluan Kerja",
      description:
        "Pedoman dan haluan operasional organisasi yang menjadi acuan utama pelaksanaan program kerja setiap kepengurusan.",
      icon: BookOpen,
      code: "GBHK",
    },
    {
      title: "AD-ART ALSA LC UNSRAT",
      fullName: "Anggaran Dasar & Anggaran Rumah Tangga",
      description:
        "Konstitusi dasar dan peraturan internal tertinggi yang mengatur keanggotaan, struktur, dan tata kelola ALSA LC Unsrat.",
      icon: Shield,
      code: "AD-ART",
    },
    {
      title: "SOP ALSA LC UNSRAT",
      fullName: "Standard Operating Procedure",
      description:
        "Standar operasional baku untuk administrasi, keuangan, kepanitiaan, dan hubungan kelembagaan.",
      icon: FileCheck2,
      code: "SOP",
    },
  ];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/resources");
        if (response.ok) {
          const data = await response.json();
          setResources(data);
        }
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8faff] text-gray-900">
      <Navigation />

      {/* Hero Header Banner */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0e2544] via-[#163967] to-[#1d4880] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/15 via-transparent to-transparent pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
            <span>Documents</span>
            <span>&bull;</span>
            <span>Legal Repository</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
            Legal Resources & Documents
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
            Akses dokumen resmi konstitusi, haluan kerja, dan prosedur operasional
            baku ALSA Local Chapter Universitas Sam Ratulangi.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing container-custom max-w-6xl">
        {/* Core Statutory Documents (GBHK, AD-ART, SOP) */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-600 block mb-1">
              Statutory Framework
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#163967]">
              Dokumen Resmi Pokok
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              GBHK, AD-ART, dan Standar Operasional Prosedur kelembagaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {officialLegalDocs.map((doc) => {
              const Icon = doc.icon;
              return (
                <div
                  key={doc.title}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-blue-50 shadow-[0_4px_25px_rgba(22,57,103,0.04)] hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#163967] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                      {doc.code}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#163967] mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 mb-3">
                      {doc.fullName}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {doc.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-400">
                      Format: PDF
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#163967] text-xs font-bold group-hover:bg-[#163967] group-hover:text-white transition-colors">
                      <FileText size={13} />
                      <span>Official PDF</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Database Uploaded Resources List */}
        <div>
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#163967]">
                Arsip & Publikasi Dokumen
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Dokumen pendukung dan arsip yang diunggah melalui sistem penyimpanan
                Firebase & Supabase.
              </p>
            </div>
            <span className="text-xs font-bold text-[#163967] bg-blue-50 px-3 py-1 rounded-full">
              {resources.length} Dokumen Tersedia
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-5 w-4/5 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-full rounded-md" />
                    <Skeleton className="h-3.5 w-2/3 rounded-md" />
                  </div>
                  <div className="pt-2">
                    <Skeleton className="h-9 w-36 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto shadow-sm">
              <FileText size={36} className="text-blue-300 mx-auto mb-3" />
              <p className="font-serif text-base font-bold text-[#163967] mb-1">
                Belum ada berkas tambahan
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Berkas PDF lainnya dapat diunggah melalui dashboard admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-50 text-[#163967]">
                        {resource.category || "General"}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(resource.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#163967] mb-1">
                      {resource.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                      {resource.description}
                    </p>
                  </div>

                  {/* Files download links */}
                  {resource.resource_files && resource.resource_files.length > 0 ? (
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      {resource.resource_files.map((file) => (
                        <a
                          key={file.id}
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-[#163967] text-[#163967] hover:text-white transition-all text-xs font-semibold group"
                        >
                          <span className="truncate mr-2">{file.file_name}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="uppercase text-[10px] opacity-75">
                              {file.file_type}
                            </span>
                            <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : resource.file_url ? (
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-[#163967] text-[#163967] hover:text-white transition-all text-xs font-semibold group mt-3"
                    >
                      <span>Download PDF File</span>
                      <Download size={14} />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}