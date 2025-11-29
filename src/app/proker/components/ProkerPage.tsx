"use client";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";

interface Proker {
  id: string;
  title: string;
  description: string;
  status: "ongoing" | "archived";
  startDate: string;
}

export default function ProkerPage() {
  const [prokers, setProkers] = useState<Proker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ongoing" | "archived" | "all">("all");

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

  const filteredProkers =
    filter === "all" ? prokers : prokers.filter((p) => p.status === filter);

  return (
    <main>
      <Navigation />
      <section className="relative h-64 bg-primary overflow-hidden">
        <div className="relative container-custom h-full flex items-end pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-white">Work Program</h1>
        </div>
      </section>

      <section className="section-spacing container-custom">
        <div className="flex gap-2 mb-8">
          {(["all", "ongoing", "archived"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded font-semibold transition-colors capitalize ${
                filter === status
                  ? "bg-accent text-white"
                  : "bg-neutral-light text-neutral-dark hover:bg-primary hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading proker...</div>
        ) : filteredProkers.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">
            No program kerja found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProkers.map((proker) => (
              <div
                key={proker.id}
                className="bg-white border-l-4 border-accent p-6 rounded shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl font-bold text-primary">
                    {proker.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold capitalize ${
                      proker.status === "ongoing"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {proker.status}
                  </span>
                </div>
                <p className="text-neutral-medium mb-2">{proker.description}</p>
                <p className="text-sm text-neutral-medium">
                  Started: {new Date(proker.startDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
