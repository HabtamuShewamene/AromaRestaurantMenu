import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CartManager from "@/features/cart/components/CartManager";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#080808]">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 pt-28 pb-28 sm:pb-24">
        <div className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold">Order Summary</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-playfair">
            Your Dining Cart
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Review your selected dishes and send your order directly to the kitchen.
          </p>
        </div>
        <CartManager />
      </section>
      <Footer />
    </main>
  );
}
