import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import CartManager from "@/components/client/CartManager";

export default function CartPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pt-32 pb-24">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold-500">Cart</p>
          <h1 className="text-5xl font-bold tracking-tight">Review your order before checkout.</h1>
          <p className="mt-4 max-w-2xl text-zinc-500">
            Clients can update quantities, remove items, and place orders. Admins can still browse but cannot use
            this to manage menu data.
          </p>
        </div>
        <CartManager />
      </section>
      <Footer />
    </main>
  );
}
