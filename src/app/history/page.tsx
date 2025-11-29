import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function HistoryPage() {
  const timeline = [
    {
      year: "1989",
      title: "Founding of ALSA",
      description:
        "ALSA is founded as a non-political, non-profit association for Asian law students.",
    },
    {
      year: "1999",
      title: "ALSA Indonesia Established",
      description:
        "ALSA Indonesia becomes a full and founding member of the international organization.",
    },
    {
      year: "2010",
      title: "LC Unsrat Foundation",
      description:
        "ALSA Local Chapter Universitas Sam Ratulangi is officially established.",
    },
    {
      year: "2015",
      title: "Growth & Recognition",
      description:
        "The chapter expands with increased members and recognition in academic circles.",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description:
        "Adaptation to digital platforms for events and member engagement.",
    },
    {
      year: "2024",
      title: "Present Day",
      description:
        "Continuing to develop as a premier organization in legal education and student development.",
    },
  ];

  return (
    <main>
      <Navigation />
      <section className=" pb-12 md:px-0">
        <div className="w-full bg-primary pt-20 pb-2">
          <h1 className="sections-spacing container-custom text-5xl font-bold align-bottom text-start mb-12 text-background">
            History Of - ALSA LC UNSRAT
          </h1>
        </div>

        <div className="section-spacing container-custom max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6 mb-8 relative">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-1 h-16 bg-neutral-light mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-serif text-2xl font-bold text-primary mb-1">
                    {item.year}
                  </h3>
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-neutral-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
