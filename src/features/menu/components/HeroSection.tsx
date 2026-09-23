"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

const HERO_IMAGES = [
  "/slider-0.jpeg",
  "/slider-1.jpeg",
  "/slider-2.jpeg",
  "/slider-3.jpeg",
  "/slider-4.jpeg",
  "/slider-5.jpeg",
  "/slider-6.jpeg"
];

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { locale, t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const scrollToMenu = () => {
    document.getElementById("menu-explorer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem] h-[46vh] min-h-[300px] sm:min-h-[360px] max-h-[440px]"
    >
      {/* Background Image Slider */}
      <div className="absolute inset-0 bg-black">
        {HERO_IMAGES.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`${restaurant.name} Atmosphere ${index + 1}`}
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-[1500ms] ease-in-out ${
              index === currentImageIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            sizes="100vw"
          />
        ))}
      </div>

      {/* Layered gradient overlays for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-[#171918]" />
      
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

          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary/90 font-medium mb-0.5">
            {t("hero.welcome_to")}
          </p>
          <h1 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-wide text-center">
            {restaurant.name}
          </h1>
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
            className={`group relative overflow-hidden rounded-full bg-primary text-primary-foreground px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-[0_2px_15px_rgba(182,141,64,0.3)] ${locale === "am" ? "font-amharic" : ""}`}
          >
            <span className="relative z-10">{t("hero.view_menu")}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
        </motion.div>
      </div>

      {/* Bottom fade blend */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#171918] to-transparent pointer-events-none" />
    </section>
  );
}
