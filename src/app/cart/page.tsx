import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import Cart from "@/components/client/Cart";

const cartItems = [
  { id: "1", name: "Vanilla Latte", quantity: 2, price: 5.5 },
  { id: "2", name: "Almond Croissant", quantity: 1, price: 4.5 },
];

export default function CartPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pt-32 pb-24">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold-500">Cart</p>
          <h1 className="text-5xl font-bold tracking-tight">Review your order before checkout.</h1>
        </div>
        <Cart items={cartItems} />
      </section>
      <Footer />
    </main>
  );
}
