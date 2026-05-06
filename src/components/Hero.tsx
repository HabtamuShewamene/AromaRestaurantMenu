"use client";

import { motion } from "framer-motion";
import { Coffee, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-900/20 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-sm font-medium mb-8">
            <Coffee className="h-4 w-4" />
            <span>Premium Coffee & Pastries</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">
            Elevate Your <br />
            <span className="text-gradient">Daily Ritual</span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Experience the art of coffee making. From hand-picked beans to expert roasting, 
            every cup is a masterpiece waiting to be savored.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-gold-600 hover:bg-gold-700 text-black px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2">
              View Menu <ArrowRight className="h-5 w-5" />
            </button>
            <button className="glass hover:bg-white/10 text-white px-10 py-4 rounded-full font-bold text-lg transition-all">
              Our Story
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll to explore</span>
        <div className="w-px h-12 bg-white" />
      </motion.div>
    </section>
  );
}
