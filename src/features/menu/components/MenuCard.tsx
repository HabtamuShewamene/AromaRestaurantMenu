"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, Check, Play, ExternalLink } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { MenuItemRecord } from "@/shared/types/app";
import { useCart } from "@/components/providers/CartProvider";

import { useLanguage } from "@/components/providers/LanguageProvider";

type MenuCardProps = {
  item: MenuItemRecord & { averageRating?: number; totalReviews?: number };
  onViewDetails?: (item: MenuItemRecord) => void;
  index?: number;
};

function getTikTokVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/\/video\/(\d+)/);
  return m ? m[1] : null;
}

function isPhotoPost(url: string | null | undefined): boolean {
  return !!url && url.includes("/photo/");
}

export default function MenuCard({ item, onViewDetails, index = 0 }: MenuCardProps) {
  const { addToCart } = useCart();
  const { locale, t } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rating = item.averageRating || 0;
  const reviewCount = item.totalReviews || 0;
  const categoryName = typeof item.category === "string" 
    ? item.category 
    : (locale === "am" && item.category.nameAm ? item.category.nameAm : item.category.name);
    
  const itemName = locale === "am" && item.nameAm ? item.nameAm : item.name;
  const itemDescription = locale === "am" && item.descriptionAm ? item.descriptionAm : item.description;

  const tiktokId = getTikTokVideoId(item.videoUrl);
  const isPhoto = isPhotoPost(item.videoUrl);
  const hasVideo = !!tiktokId && !isPhoto;

  const handleMouseEnter = useCallback(() => {
    if (!hasVideo) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowVideo(true), 400);
  }, [hasVideo]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowVideo(false);
    setVideoLoaded(false);
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    addToCart(item, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      onClick={() => onViewDetails?.(item)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-[1.75rem] flex flex-col h-full ${locale === "am" ? "font-amharic" : ""}`}
      style={{
        background: "rgba(16,16,16,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
      }}
    >
      <div className="relative h-32 sm:h-44 md:h-48 overflow-hidden rounded-t-2xl sm:rounded-t-[1.75rem]">
        <Image
          src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
          alt={itemName}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ opacity: showVideo && videoLoaded ? 0 : 1, transition: "opacity 0.4s ease" }}
        />

        <AnimatePresence>
          {showVideo && tiktokId && (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: videoLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={`/api/video?id=${tiktokId}`}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {showVideo && !videoLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"
          style={{ zIndex: showVideo && videoLoaded ? 0 : 2 }}
        />

        {item.videoUrl && !showVideo && (
          <div
            className="absolute bottom-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "rgba(0,0,0,0.72)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
          >
            {hasVideo ? (
              <>
                <Play className="w-2.5 h-2.5 fill-white text-foreground" />
                <span className="text-[9px] font-bold text-foreground">Watch</span>
              </>
            ) : (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-2.5 h-2.5 text-foreground" />
                <span className="text-[9px] font-bold text-foreground">TikTok</span>
              </a>
            )}
          </div>
        )}

        {showVideo && videoLoaded && (
          <div
            className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.75)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.5a8.19 8.19 0 004.79 1.52V6.56a4.85 4.85 0 01-1.02.13z"/>
            </svg>
            <span className="text-[9px] font-bold text-foreground">Live</span>
          </div>
        )}

        <div
          className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold text-brand-300 font-playfair shadow-md z-20"
          style={{ background: "rgba(8,8,8,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(182,141,64,0.35)" }}
        >
          {item.price.toFixed(0)} Birr
        </div>

        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 flex-wrap max-w-[65%] z-20">
          <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${item.isAvailable ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            {item.isAvailable ? "Available" : "Sold Out"}
          </span>
          {item.isFeatured && (
            <span className="hidden xs:inline-block px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-primary/20 text-brand-300 border border-primary/40">
              Chef Pick
            </span>
          )}
        </div>

        {reviewCount > 0 && (
          <div
            className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full z-20"
            style={{ background: "rgba(8,8,8,0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Star className="w-2.5 h-2.5 fill-brand-400 text-primary" />
            <span className="text-[10px] font-bold text-primary">{rating.toFixed(1)}</span>
            <span className="text-[9px] text-muted-foreground">({reviewCount})</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-2.5 sm:p-4 pt-2.5 sm:pt-3.5">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-primary font-semibold mb-0.5 truncate">{categoryName}</p>
        <h3 className={`font-semibold text-foreground text-xs sm:text-base leading-snug mb-1 line-clamp-1 group-hover:text-brand-300 transition-colors ${locale === "am" ? "font-amharic" : "font-playfair"}`}>{itemName}</h3>
        <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2.5 sm:mb-4 flex-1">{itemDescription}</p>

        <div className="mt-auto pt-2 sm:pt-3 border-t border-border flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onViewDetails?.(item); }}
            className="text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider py-1 px-1 sm:px-2 rounded hover:bg-foreground/5"
          >
            {t("menu.view_details")}
          </button>
          <button
            type="button"
            disabled={!item.isAvailable}
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${!item.isAvailable ? "bg-zinc-800 text-muted-foreground cursor-not-allowed" : justAdded ? "bg-green-500 text-primary-foreground shadow-[0_0_12px_rgba(34,197,94,0.4)]" : "bg-primary text-primary-foreground hover:bg-primary hover:scale-[1.03] active:scale-95 shadow-[0_2px_10px_rgba(182,141,64,0.25)]"}`}
          >
            {justAdded ? (
              <><Check className="w-3 h-3 stroke-[2.5]" /><span>Added</span></>
            ) : (
              <><Plus className="w-3 h-3 stroke-[2.5]" /><span>{t("menu.add_to_cart")}</span></>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
