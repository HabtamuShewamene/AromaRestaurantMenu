import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import FilterBar from "@/components/client/FilterBar";
import MenuCard from "@/components/client/MenuCard";
import SearchBar from "@/components/client/SearchBar";

const menuItems = [
  {
    id: "1",
    name: "Signature Cappuccino",
    price: 5.25,
    description: "Velvety milk foam layered over a bold double shot of espresso.",
    category: "Hot Coffee",
    image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Iced Mocha",
    price: 6.1,
    description: "Chocolate-forward espresso served chilled over ice.",
    category: "Cold Brew",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Honey Toast",
    price: 8.4,
    description: "Toasted brioche with whipped ricotta, honey, and citrus zest.",
    category: "Brunch",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
  },
];

export default function MenuPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 pt-32 pb-24">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold-500">Cafe Menu</p>
            <h1 className="text-5xl font-bold tracking-tight">Browse every drink, pastry, and plate.</h1>
          </div>
          <SearchBar />
        </div>
        <div className="mb-10">
          <FilterBar categories={["All", "Hot Coffee", "Cold Brew", "Tea", "Brunch", "Pastries"]} />
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
