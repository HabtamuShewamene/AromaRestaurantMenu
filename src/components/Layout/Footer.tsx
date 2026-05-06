import Link from "next/link";
import { Coffee } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950/50 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-4">
        <div className="col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <Coffee className="h-8 w-8 text-gold-500" />
            <span className="text-2xl font-bold tracking-tighter text-gradient">ELITE CAFE</span>
          </div>
          <p className="mb-8 max-w-sm text-zinc-500">
            Bringing the art of specialty coffee to your neighborhood with a polished digital ordering experience.
          </p>
        </div>
        <div>
          <h4 className="mb-6 font-bold">Explore</h4>
          <ul className="space-y-4 text-zinc-500">
            <li>
              <Link href="/menu" className="transition-colors hover:text-gold-500">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/cart" className="transition-colors hover:text-gold-500">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/orders" className="transition-colors hover:text-gold-500">
                Orders
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 font-bold">Contact</h4>
          <ul className="space-y-4 text-zinc-500">
            <li>hello@elitecafe.com</li>
            <li>+1 (555) 000-0000</li>
            <li>123 Coffee Lane, Brew City</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
