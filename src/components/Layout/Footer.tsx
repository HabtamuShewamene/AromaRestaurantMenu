import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/80 py-16 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:px-8 md:grid-cols-3">
        {/* Brand column */}
        <div className="col-span-1 md:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 relative">
              <img src="/aroma-logo.png?v=3" alt="Aroma Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground font-playfair">
                AROMA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-primary font-semibold uppercase -mt-1">
                Restaurant
              </span>
            </div>
          </div>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Experience exceptional gourmet dining, handcrafted beverages, and unforgettable culinary craftsmanship in an atmosphere of luxury and comfort.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>Open Daily: 08:00 AM – 11:30 PM</span>
          </div>
        </div>



        {/* Contact Info */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-foreground uppercase tracking-wider">Contact & Location</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="flex flex-col">
                <span>Debre Birhan, Tebasse Gebeyehu</span>
                <span>Building, 1st Floor</span>
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <span>+251 959 104 671</span>
            </li>
            <li className="flex items-center gap-3 pt-2 border-t border-border">
              <div className="flex items-center gap-1.5">
                <a href="https://facebook.com/aroma_restaurant" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://instagram.com/aroma_restaurant" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@aromarestaurantdb" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="font-extrabold text-[15px] leading-none mb-0.5">♪</span>
                </a>
              </div>
              <a href="https://www.tiktok.com/@aromarestaurantdb" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-sm font-medium">
                @aromarestaurantdb
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 mt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <p>© {new Date().getFullYear()} Aroma Restaurant. All rights reserved.</p>
        <p>Crafted for fine culinary experiences.</p>
      </div>
    </footer>
  );
}
