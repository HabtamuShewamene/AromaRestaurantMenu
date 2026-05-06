import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import Hero from "@/components/Hero";
import FilterBar from "@/components/client/FilterBar";
import MenuCard from "@/components/client/MenuCard";
import SearchBar from "@/components/client/SearchBar";

export default function Home() {
  const items = [
    {
      id: "1",
      name: "Vanilla Latte",
      price: 5.5,
      description: "Smooth espresso with creamy steamed milk and vanilla.",
      category: "Hot Coffee",
      image: "https://images.unsplash.com/photo-1595434066389-99c30150fc64?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Avocado Toast",
      price: 12,
      description: "Sourdough bread topped with fresh avocado and chili flakes.",
      category: "Brunch",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Almond Croissant",
      price: 4.5,
      description: "Buttery, flaky pastry filled with sweet almond cream.",
      category: "Pastries",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <main className="relative">
      <Navbar />
      <Hero />

      <section id="menu" className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-4">Our <span className="text-gold-500">Curated Menu</span></h2>
            <p className="text-zinc-400">Discover our selection of premium coffees and artisanal treats.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchBar />
          </div>
        </div>

        <FilterBar categories={["All", "Hot Coffee", "Cold Brew", "Tea", "Pastries", "Desserts"]} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
