import Navbar from "@/components/Layout/Navbar";
import MenuExplorer from "@/features/menu/components/MenuExplorer";

export const metadata = {
  title: "Elite Café | Luxury Menu",
  description: "Explore our premium selection of dishes and beverages.",
};

export default function MenuPage() {
  return (
    <main className="bg-[#080808] min-h-screen">
      <Navbar />
      <MenuExplorer showHero={true} />
    </main>
  );
}
