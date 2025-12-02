import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative hero-spacing text-white h-[600px] flex items-center overflow-hidden">
      
      <div className="absolute inset-0 -z-20">
        <Image
          src="/manado.jpg" 
          alt="ALSA LC Unsrat "
          fill
          priority
          className="object-cover" 
        />
      </div>

      <div className="absolute inset-0 bg-black/60 -z-10" /> 

      <div className="relative z-10 container-custom flex flex-col justify-center items-center text-center">
        <h1 className="text-white text-4xl md:text-6xl font-serif font-bold mb-4">
          ALSA LC UNSRAT
        </h1>
        <p className="text-lg md:text-xl text-neutral-light mb-4 max-w-2xl">
          Always be one! Connecting and developing future leaders in law.
        </p>
        <p className="text-neutral-light mb-8 max-w-2xl">
          Asian Law Students Association - Local Chapter Universitas Sam Ratulangi
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/history" className="btn-primary hover:bg-accent-base hover:text-primary">
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