import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/features/menu/components/HeroSection";
import MenuExplorer from "@/features/menu/components/MenuExplorer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection mode="compact" />
      <MenuExplorer showHero={false} />
      <Footer />
    </main>
  );
}
