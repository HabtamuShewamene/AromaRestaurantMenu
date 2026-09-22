import Navbar from "@/components/layout/Navbar";
import MenuExplorer from "@/features/menu/components/MenuExplorer";

export const metadata = {
  title: "Aroma Restaurant | Fine Dining Menu",
  description: "Explore our premium selection of dishes, culinary creations, and handcrafted beverages.",
};

export default function MenuPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <MenuExplorer showHero={true} />
    </main>
  );
}
