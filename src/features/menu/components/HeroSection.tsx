"use client";

import { motion } from "framer-motion";
import { ChefHat, Sparkles } from "lucide-react";
import Image from "next/image";

type HeroSectionProps = {
  mode?: "compact" | "full";
};

export default function HeroSection({ mode = "full" }: HeroSectionProps) {
  return (
    <section
      className={`relative w-full overflow-hidden rounded-b-[2.5rem] ${
        mode === "compact"
          ? "h-[50vh] min-h-[380px] max-h-[620px]"
          : "h-[60vh] min-h-[420px] sm:h-[88vh] sm:min-h-[600px] max-h-[850px]"
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90"
          alt="Luxury dining experience"
          fill
          priority
          className="object-cover scale-105 transition-transform duration-[15s] ease-out hover:scale-100"
          sizes="100vw"
        />
      </div>

      {/* Layered gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#080808]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

      {/* Luxury vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(8,8,8,0.7) 100%)",
        }}
      />

      {/* Top bar branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 pt-6 sm:pt-8 pb-4"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gold-500/20 backdrop-blur-md border border-gold-500/30">
            <ChefHat className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/80 leading-none">
              Elite
            </p>
            <p className="text-sm font-semibold tracking-wider text-white leading-tight">
              Café & Hotel
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-zinc-300 font-medium">Open Now</span>
        </div>
      </motion.div>

      {/* Main hero content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pb-20 sm:pb-28">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold-500/15 border border-gold-500/30 backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-xs font-medium tracking-widest uppercase text-gold-300">
            Luxury Dining Experience
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-playfair text-center font-bold leading-[1.05] mb-4"
          style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)" }}
        >
          <span className="block text-white">Your Table,</span>
          <span
            className="block"
            style={{
              background:
                "linear-gradient(135deg, #d8c491 0%, #b68d40 50%, #c5a469 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Your Taste.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center text-zinc-300/80 text-base md:text-lg max-w-sm leading-relaxed mb-8"
        >
          Curated flavors crafted for every moment. Order directly to your
          table.
        </motion.p>

        {/* CTA decorative stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex items-center gap-6"
        >
          {[
            { value: "50+", label: "Dishes" },
            { value: "4.9★", label: "Rating" },
            { value: "15min", label: "Service" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-gold-400">{stat.value}</p>
              <p className="text-[11px] uppercase tracking-widest text-zinc-500">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade blend */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent" />
    </section>
  );
}
