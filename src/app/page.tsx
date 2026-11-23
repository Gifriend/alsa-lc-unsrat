"use client";

import Navigation from "@/components/navigation";
import Hero from "@/components/sections/hero";
import DirectorStatement from "@/components/sections/director-statement";
import WhatIsAlsa from "@/components/sections/what-is-alsa";
import InNumbers from "@/components/sections/in-numbers";
import ActivitiesVideo from "@/components/sections/activities-video";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 relative selection:bg-[#163967] selection:text-white">
      {/* Dynamic Glassmorphic Navigation */}
      <Navigation />

      {/* Hero Section with Parallax Background & Recessed Trapezoid Notch */}
      <Hero />

      {/* 
        Scroll Content Sheet:
        Connects seamlessly to the hero trapezoid notch with a high-end frosted ice-blue gradient
      */}
      <motion.div
        initial={{ opacity: 0.95 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-gradient-to-b from-white via-[#f3f7fd] to-[#eef4fb] -mt-px overflow-hidden"
      >
        {/* Subtle decorative background light accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-gradient-to-b from-blue-100/50 via-blue-50/20 to-transparent blur-3xl pointer-events-none" />

        {/* 1. Director Opening Statement */}
        <DirectorStatement />

        {/* 2. What is ALSA + 4 Pillars + Vision/Mission Cards */}
        <WhatIsAlsa />

        {/* 3. Our Statistics with 50% Overhanging Cards */}
        <InNumbers />

        {/* 4. Local Chapter Activities + Video Profile */}
        <ActivitiesVideo />
      </motion.div>

      {/* Footer / Contact Us & Follow Us */}
      <Footer />
    </main>
  );
}
