import Link from "next/link"

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary to-primary-light hero-spacing text-white">
      <div className="container-custom flex flex-col justify-center items-center text-center">
        <h1 className="text-white text-4xl md:text-6xl font-serif font-bold mb-4">ALSA LC Unsrat</h1>
        <p className="text-lg md:text-xl text-neutral-light mb-4 max-w-2xl">
          Always be one! Connecting and developing future leaders in law.
        </p>
        <p className="text-neutral-light mb-8 max-w-2xl">
          Asian Law Students Association - Local Chapter Universitas Sam Ratulangi
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/history" className="btn-primary">
            Explore Our History
          </Link>
          <Link href="/bod" className="btn-secondary">
            Meet Our Team
          </Link>
        </div>
      </div>
    </section>
  )
}
