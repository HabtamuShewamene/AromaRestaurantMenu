import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import OrdersHistory from "@/features/orders/components/OrdersHistory";

export default function OrdersPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pt-32 pb-24">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">Orders</p>
          <h1 className="text-5xl font-bold tracking-tight">Track every order from placed to pickup.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Clients can see only their own order history. Admins use the dashboard to manage every order in the system.
          </p>
        </div>
        <OrdersHistory />
      </section>
      <Footer />
    </main>
  );
}
