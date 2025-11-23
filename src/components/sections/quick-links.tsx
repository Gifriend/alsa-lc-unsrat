import Link from "next/link"

export default function QuickLinks() {
  const links = [
    { href: "/history", label: "History Timeline", desc: "Explore our journey since founding" },
    { href: "/founders", label: "Founders", desc: "Meet the founding members" },
    { href: "/bod", label: "Board of Directors", desc: "Current leadership team" },
    { href: "/resources", label: "Resources", desc: "Download documents & materials" },
  ]

  return (
    <section className="section-spacing bg-neutral-light">
      <div className="container-custom">
        <h2 className="text-center mb-12">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white p-6 rounded shadow hover:shadow-lg hover:border-l-4 hover:border-accent transition-all"
            >
              <h3 className="font-serif text-lg font-bold text-primary mb-2">{link.label}</h3>
              <p className="text-neutral-medium text-sm">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
