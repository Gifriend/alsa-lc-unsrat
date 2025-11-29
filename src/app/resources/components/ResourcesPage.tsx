"use client";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  description: string;
  file_url: string;
  file_type: string;
  created_at: string;
  category: string; // Tambah category
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const officialResources = resources.filter((r) => r.category === "official");
  const otherResources = resources.filter((r) => r.category === "other");

  return (
    <main>
      <Navigation />
      <section className="relative h-64 bg-primary overflow-hidden">
        <div className="relative container-custom h-full flex items-end pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-white">
            Resources Of - ALSA LC UNSRAT
          </h1>
        </div>
      </section>

      <section className="section-spacing container-custom">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading resources...
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No resources available yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-primary">
                Official Documents
              </h2>
              {officialResources.length === 0 ? (
                <p className="text-gray-500">No official documents yet.</p>
              ) : (
                <div className="space-y-6">
                  {officialResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-primary mb-2">
                          {resource.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {resource.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {resource.file_type.toUpperCase()} • Uploaded{" "}
                          {new Date(resource.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {resource.file_url ? (
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2 whitespace-nowrap self-start"
                        >
                          <Download size={18} />
                          <span>View/Download</span>
                        </a>
                      ) : (
                        <span className="mt-4 px-4 py-2 bg-gray-300 text-gray-600 rounded-md flex items-center gap-2 whitespace-nowrap self-start">
                          No File
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 text-primary">
                Other Contents
              </h2>
              {otherResources.length === 0 ? (
                <p className="text-gray-500">No other contents yet.</p>
              ) : (
                <div className="space-y-6">
                  {otherResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-primary mb-2">
                          {resource.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {resource.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {resource.file_type.toUpperCase()} • Uploaded{" "}
                          {new Date(resource.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {resource.file_url ? (
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2 whitespace-nowrap self-start"
                        >
                          <Download size={18} />
                          <span>View/Download</span>
                        </a>
                      ) : (
                        <span className="mt-4 px-4 py-2 bg-gray-300 text-gray-600 rounded-md flex items-center gap-2 whitespace-nowrap self-start">
                          No File
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
