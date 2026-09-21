"use client";

import { motion } from "framer-motion";
import { ChefHat, MapPin, Phone, Clock } from "lucide-react";
import Image from "next/image";

type HeroSectionProps = {
  mode?: "compact" | "full";
};

// Restaurant branding details
const restaurant = {
  name: "Aroma Restaurant",
  tagline: "Fine Dining & Artisan Culinary Experience",
  coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=85",
  description: "Experience exceptional gourmet cuisine, handcrafted beverages, and unforgettable culinary craftsmanship in an atmosphere of refined luxury.",
  openingTime: "08:00 AM",
  closingTime: "11:30 PM",
  address: "450 Grand Avenue, Financial District",
  phone: "+1 (555) 342-7662",
  socialLinks: { 
    instagram: "#", 
    facebook: "#", 
    twitter: "#" 
  }
};

export default function HeroSection({ mode = "full" }: HeroSectionProps) {
  const scrollToMenu = () => {
    document.getElementById("menu-explorer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className={`relative w-full overflow-hidden rounded-b-[2.5rem] ${
        mode === "compact"
          ? "h-[50vh] min-h-[380px] max-h-[620px]"
          : "h-[85vh] min-h-[600px] max-h-[900px]"
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={restaurant.coverImage}
          alt={restaurant.name}
          fill
          priority
          className="object-cover scale-105 transition-transform duration-[20s] ease-out hover:scale-100"
          sizes="100vw"
        />
      </div>

      {/* Layered gradient overlays for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#080808]" />
      
      {/* Radial gradient for focus */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, transparent 20%, rgba(8,8,8,0.85) 100%)",
        }}
      />

      {/* Main hero content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 z-10 pt-16">
        
        {/* Logo and Name */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mb-6"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 backdrop-blur-md border border-gold-500/40 mb-4 shadow-[0_0_30px_rgba(216,196,145,0.2)]">
            <ChefHat className="w-8 h-8 text-gold-400" />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold-400/90 font-medium mb-1">
            Welcome to
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide text-center">
            {restaurant.name}
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-zinc-300 text-base md:text-lg max-w-2xl leading-relaxed mb-8 font-light"
        >
          {restaurant.description}
        </motion.p>

        {/* Restaurant Details Info Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10 text-sm text-zinc-300 bg-black/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-400" />
            <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span>{restaurant.address}</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gold-400" />
            <span>{restaurant.phone}</span>
          </div>
        </motion.div>

        {/* Social Links & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <button 
            onClick={scrollToMenu}
            className="group relative overflow-hidden rounded-full bg-gold-500 text-black px-8 py-3.5 font-medium tracking-wide transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">View Menu</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>

          <div className="flex items-center gap-5 mt-4">
            <a href={restaurant.socialLinks.instagram} className="text-zinc-400 font-bold hover:text-gold-400 transition-colors">
              IG
            </a>
            <a href={restaurant.socialLinks.facebook} className="text-zinc-400 font-bold hover:text-gold-400 transition-colors">
              FB
            </a>
            <a href={restaurant.socialLinks.twitter} className="text-zinc-400 font-bold hover:text-gold-400 transition-colors">
              X
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade blend */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
    </section>
  );
}
