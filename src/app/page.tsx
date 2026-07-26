import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
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
