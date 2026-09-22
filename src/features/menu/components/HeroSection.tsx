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

export default function HeroSection({ mode = "compact" }: HeroSectionProps) {
  const scrollToMenu = () => {
    document.getElementById("menu-explorer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem] h-[46vh] min-h-[300px] sm:min-h-[360px] max-h-[440px]"
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-[#080808]" />
      
      {/* Radial gradient for focus */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, transparent 20%, rgba(8,8,8,0.85) 100%)",
        }}
      />

      {/* Main hero content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 z-10 pt-10 sm:pt-14">
        
        {/* Logo and Name */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center mb-2 sm:mb-3"
        >
          <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mb-2 sm:mb-4 relative animate-fade-in z-10" style={{ animationDelay: "100ms" }}>
            <img src="/aroma-logo.png?v=3" alt="Aroma Logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-400/90 font-medium mb-0.5">
            Welcome to
          </p>
          <h1 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide text-center">
            {restaurant.name}
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center text-zinc-300 text-xs sm:text-sm max-w-xl leading-relaxed mb-2.5 sm:mb-3.5 font-light line-clamp-2 px-2"
        >
          {restaurant.description}
        </motion.p>

        {/* Restaurant Details Info Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 mb-3 sm:mb-4 text-[11px] sm:text-xs text-zinc-300 bg-black/40 backdrop-blur-md px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl border border-white/5"
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-white/10" />
          <div className="hidden xs:flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>{restaurant.address}</span>
          </div>
          <div className="hidden md:block w-px h-3 bg-white/10" />
          <div className="hidden md:flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gold-400" />
            <span>{restaurant.phone}</span>
          </div>
        </motion.div>

        {/* Social Links & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <button 
            onClick={scrollToMenu}
            className="group relative overflow-hidden rounded-full bg-gold-500 text-black px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-[0_2px_15px_rgba(182,141,64,0.3)]"
          >
            <span className="relative z-10">View Menu</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>

          <div className="flex items-center gap-3 text-xs">
            <a href={restaurant.socialLinks.instagram} className="text-zinc-400 font-bold hover:text-gold-400 transition-colors text-[11px]">
              IG
            </a>
            <a href={restaurant.socialLinks.facebook} className="text-zinc-400 font-bold hover:text-gold-400 transition-colors text-[11px]">
              FB
            </a>
            <a href={restaurant.socialLinks.twitter} className="text-zinc-400 font-bold hover:text-gold-400 transition-colors text-[11px]">
              X
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade blend */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
    </section>
  );
}
