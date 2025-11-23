import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function HistoryPage() {
  const timeline = [
    {
      year: "1989",
      title: "Founding of ALSA",
      description: "ALSA is founded as a non-political, non-profit association for Asian law students.",
    },
    {
      year: "1999",
      title: "ALSA Indonesia Established",
      description: "ALSA Indonesia becomes a full and founding member of the international organization.",
    },
    {
      year: "2010",
      title: "LC Unsrat Foundation",
      description: "ALSA Local Chapter Universitas Sam Ratulangi is officially established.",
    },
    {
      year: "2015",
      title: "Growth & Recognition",
      description: "The chapter expands with increased members and recognition in academic circles.",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Adaptation to digital platforms for events and member engagement.",
    },
    {
      year: "2024",
      title: "Present Day",
      description: "Continuing to develop as a premier organization in legal education and student development.",
    },
  ]

  return (
    <main>
      <Navigation />
      <section className="section-spacing container-custom">
        <h1 className="mb-12">History of ALSA LC Unsrat</h1>
        <div className="max-w-3xl mx-auto">
          {timeline.map((item, index) => (
            <div key={item.year} className="flex gap-6 mb-8 relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                {index < timeline.length - 1 && <div className="w-1 h-16 bg-neutral-light mt-2" />}
              </div>
              <div className="pb-8">
                <h3 className="font-serif text-2xl font-bold text-primary mb-1">{item.year}</h3>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-neutral-medium">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
