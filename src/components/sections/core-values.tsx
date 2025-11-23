export default function CoreValues() {
  const values = [
    {
      title: "Internationally Minded",
      icon: "🌍",
    },
    {
      title: "Socially Responsible",
      icon: "🤝",
    },
    {
      title: "Academically Committed",
      icon: "📚",
    },
    {
      title: "Legally Skilled",
      icon: "⚖️",
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
              <div className="text-4xl mb-3">{value.icon}</div>
              <h3 className="font-serif text-lg font-bold text-primary">{value.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
