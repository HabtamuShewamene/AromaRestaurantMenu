import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import Hero from "@/components/Hero";

const previewItems = [
  {
    name: "Vanilla Latte",
    price: 5.5,
    description: "Smooth espresso with creamy steamed milk and vanilla.",
    category: "Hot Coffee",
    image: "https://images.unsplash.com/photo-1595434066389-99c30150fc64?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Avocado Toast",
    price: 12,
    description: "Sourdough bread topped with fresh avocado and chili flakes.",
    category: "Brunch",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Almond Croissant",
    price: 4.5,
    description: "Buttery, flaky pastry filled with sweet almond cream.",
    category: "Pastries",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    available: false,
  },
];

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />

      <section id="menu" className="mx-auto max-w-7xl px-4 py-24">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="mb-4 text-4xl font-bold">
              Our <span className="text-gold-500">Curated Menu</span>
            </h2>
            <p className="max-w-2xl text-zinc-400">
              Clients can browse the full menu, filter by category, search items, see stock status, add to cart, and
              place orders. Admins handle the system from the protected dashboard.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/menu" className="rounded-full bg-gold-600 px-6 py-3 font-bold text-black transition-colors hover:bg-gold-700">
              Browse Full Menu
            </Link>
            <Link href="/admin/dashboard" className="rounded-full border border-white/10 px-6 py-3 font-bold text-white transition-colors hover:border-gold-500 hover:text-gold-500">
              Admin Dashboard
            </Link>
          </div>
        </div>

        <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
          {["Hot Coffee", "Cold Drinks", "Food", "Pastries", "In Stock", "Out of Stock"].map((tag) => (
            <span key={tag} className="whitespace-nowrap rounded-full border border-zinc-800 bg-zinc-900 px-6 py-2 text-sm text-zinc-300">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {previewItems.map((item) => (
            <article key={item.name} className="glass-card overflow-hidden rounded-3xl">
              <div className="relative h-64 overflow-hidden">
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
                <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 font-bold text-gold-400 backdrop-blur-md">
                  ${item.price.toFixed(2)}
                </div>
              </div>
              <div className="p-8">
                <div className="mb-3 flex items-center gap-3">
                  <h3 className="text-2xl font-bold">{item.name}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.available ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                    {item.available ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold-500/80">{item.category}</p>
                <p className="text-sm text-zinc-400">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
