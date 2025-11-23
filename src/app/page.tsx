import Navigation from "@/components/navigation"
import Hero from "@/components/sections/hero"
import WhoWeAre from "@/components/sections/who-we-are"
import InNumbers from "@/components/sections/in-numbers"
import CoreValues from "@/components/sections/core-values"
import QuickLinks from "@/components/sections/quick-links"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <WhoWeAre />
      <InNumbers />
      <CoreValues />
      <QuickLinks />
      <Footer />
    </main>
  )
}
