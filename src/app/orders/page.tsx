import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";

const orders = [
  { id: "#8241", total: 19.5, status: "PREPARING", createdAt: "5 minutes ago" },
  { id: "#8238", total: 11.25, status: "READY", createdAt: "23 minutes ago" },
  { id: "#8229", total: 24.1, status: "COMPLETED", createdAt: "Yesterday" },
];

export default function OrdersPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pt-32 pb-24">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold-500">Orders</p>
          <h1 className="text-5xl font-bold tracking-tight">Track every order from placed to pickup.</h1>
        </div>
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="glass-card flex flex-col gap-4 rounded-3xl p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-zinc-500">{order.createdAt}</p>
                <h2 className="text-2xl font-bold">{order.id}</h2>
              </div>
              <div className="text-sm text-zinc-400">{order.status}</div>
              <div className="font-mono text-lg text-gold-500">${order.total.toFixed(2)}</div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
