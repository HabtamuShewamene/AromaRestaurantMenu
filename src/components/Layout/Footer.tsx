import Link from "next/link";
import { ChefHat, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950/80 py-16 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:px-8 md:grid-cols-4">
        {/* Brand column */}
        <div className="col-span-1 md:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gold-500/15 border border-gold-500/30">
              <ChefHat className="h-5 w-5 text-gold-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-playfair">
                AROMA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-gold-500 font-semibold uppercase -mt-1">
                Restaurant
              </span>
            </div>
          </div>
          <p className="mb-6 max-w-sm text-sm text-zinc-400 leading-relaxed">
            Experience exceptional gourmet dining, handcrafted beverages, and unforgettable culinary craftsmanship in an atmosphere of luxury and comfort.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock className="w-4 h-4 text-gold-500" />
            <span>Open Daily: 08:00 AM – 11:30 PM</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-white uppercase tracking-wider">Explore Menu</h4>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li>
              <Link href="/menu" className="transition-colors hover:text-gold-400">
                Menu Explorer
              </Link>
            </li>
            <li>
              <Link href="/cart" className="transition-colors hover:text-gold-400">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link href="/orders" className="transition-colors hover:text-gold-400">
                Order History & Tracking
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard" className="transition-colors hover:text-gold-400 text-gold-500/80">
                Admin Control Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-white uppercase tracking-wider">Contact & Location</h4>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
              <span>450 Grand Avenue, Financial District</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <span>+1 (555) 342-7662</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <span>contact@aromarestaurant.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <p>© {new Date().getFullYear()} Aroma Restaurant. All rights reserved.</p>
        <p>Crafted for fine culinary experiences.</p>
      </div>
    </footer>
  );
}
