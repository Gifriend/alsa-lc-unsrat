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
    <main>
      <Navigation />
      <section className="relative h-64 bg-primary overflow-hidden">
        <div className="relative container-custom h-full flex items-end pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-white">Founding Fathers & Mothers</h1>
        </div>
      </section>

      <section className="section-spacing container-custom">
        {isLoading ? (
          <div className="text-center py-12">Loading founders...</div>
        ) : founders.length === 0 ? (
          <div className="text-center py-12 text-neutral-medium">
            No founders found. Coming soon.
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
