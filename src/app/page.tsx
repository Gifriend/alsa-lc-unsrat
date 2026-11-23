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
    <main className="min-h-screen bg-slate-950 relative selection:bg-blue-600 selection:text-white">
      {/* Dynamic Glassmorphic Navigation */}
      <Navigation />

      {/* Hero Section with Parallax Background */}
      <Hero />

      {/* 
        Scroll-Up White Content Sheet:
        As user scrolls down, this rounded white sheet smoothly rises up over the hero photo.
      */}
      <motion.div
        initial={{ opacity: 0.95 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-gradient-to-b from-white via-[#f7faff] to-white rounded-t-[36px] md:rounded-t-[56px] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] pt-6 md:pt-10 overflow-hidden"
      >
        {/* Subtle decorative background light accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-gradient-to-b from-blue-100/40 to-transparent blur-3xl pointer-events-none" />

        {/* 1. Director Opening Statement */}
        <DirectorStatement />

        {/* 2. What is ALSA + 4 Pillars + Vision/Mission */}
        <WhatIsAlsa />

        {/* 3. Our Statistics with Frosted Glass Cards */}
        <InNumbers />

        {/* 4. Local Chapter Activities + Video Profile with 3D floating reactions */}
        <ActivitiesVideo />
      </motion.div>

      {/* Footer / Contact Us & Follow Us */}
      <Footer />
    </main>
  );
}
