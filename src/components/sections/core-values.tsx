import { Globe, Handshake, Book, Scale } from "lucide-react"
export default function CoreValues() {
  const values = [
    {
      title: "Internationally Minded",
      icon: Globe,
    },
    {
      title: "Socially Responsible",
      icon: Handshake,
    },
    {
      title: "Academically Committed",
      icon: Book,
    },
    {
      title: "Legally Skilled",
      icon: Scale,
    },
  ]

  return (
    <section className="section-spacing bg-white section-divider">
      <div className="container-custom">
        <h2 className="text-center mb-12">Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="p-6 rounded shadow hover:shadow-lg hover:bg-neutral-light transition-all text-center"
            >
              <div className="mb-3 flex justify-center">
                <value.icon size={48} className="text-primary" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">{value.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}