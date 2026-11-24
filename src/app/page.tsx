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
        className="relative z-10 bg-linear-to-b from-[#f5f9ff] via-[#ffffff] to-[#edf4fc] -mt-px overflow-hidden"
      >
        {/* Atmospheric Blue Gradients matching mockup photo */}
        {/* 1. Top Radiant Glow under the Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-blue-200/50 via-blue-100/30 to-transparent blur-3xl pointer-events-none" />

        {/* 2. Top-Left Shoulder Blue Accent */}
        <div className="absolute -top-16 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-blue-200/40 rounded-full blur-[100px] pointer-events-none" />

        {/* 3. Top-Right Shoulder Blue Accent */}
        <div className="absolute -top-16 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-sky-200/40 rounded-full blur-[100px] pointer-events-none" />

        {/* 4. Center-Left Ambient Glow behind Director Statement */}
        <div className="absolute top-44 -left-12 w-[440px] h-[440px] bg-blue-100/60 rounded-full blur-[110px] pointer-events-none" />

        {/* 5. Right-Side Diagonal Light-Blue Wash (around "What is ALSA") */}
        <div className="absolute top-[680px] -right-28 w-[580px] h-[580px] bg-gradient-to-bl from-blue-200/50 via-blue-100/30 to-transparent rounded-full blur-[110px] pointer-events-none" />

        {/* 6. Mid-Left Ambient Accent behind Pillars */}
        <div className="absolute top-[1150px] -left-20 w-[480px] h-[480px] bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none" />

        {/* 7. Ambient Glow around Statistics */}
        <div className="absolute top-[1650px] left-1/2 -translate-x-1/2 w-full max-w-5xl h-[420px] bg-gradient-to-r from-blue-200/30 via-sky-100/40 to-blue-200/30 blur-[120px] pointer-events-none" />

        {/* 8. Bottom Light Accent around Activities */}
        <div className="absolute bottom-28 -right-16 w-[450px] h-[450px] bg-blue-100/50 rounded-full blur-[110px] pointer-events-none" />

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
