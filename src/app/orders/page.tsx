import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import OrdersHistory from "@/features/orders/components/OrdersHistory";

export default function OrdersPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pt-32 pb-24">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold-500">Orders</p>
          <h1 className="text-5xl font-bold tracking-tight">Track every order from placed to pickup.</h1>
          <p className="mt-4 max-w-2xl text-zinc-500">
            Clients can see only their own order history. Admins use the dashboard to manage every order in the system.
          </p>
        </div>
        <OrdersHistory />
      </section>
      <Footer />
    </main>
  );
}
