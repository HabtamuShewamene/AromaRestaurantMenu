import { TrendingUp, Users, ShoppingBag, DollarSign, Plus, ArrowRight } from "lucide-react";

export default function AdminDashboardContent() {
  const stats = [
    { label: "Total Revenue", value: "$12,845", change: "+12%", icon: DollarSign, color: "text-green-500" },
    { label: "Total Orders", value: "482", change: "+18%", icon: ShoppingBag, color: "text-blue-500" },
    { label: "Active Customers", value: "1,204", change: "+7%", icon: Users, color: "text-gold-500" },
    { label: "Growth Rate", value: "24.5%", change: "+4%", icon: TrendingUp, color: "text-orange-500" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">
            Welcome Back, <span className="text-gold-500">Admin</span>
          </h1>
          <p className="text-lg text-zinc-500">Here&apos;s what&apos;s happening at Elite Cafe today.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3 font-bold text-black transition-all hover:bg-gold-700">
          <Plus className="h-5 w-5" /> Add New Item
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-3xl p-8">
            <div className="mb-6 flex items-start justify-between">
              <div className={`rounded-2xl bg-white/5 p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="rounded-lg bg-green-500/10 px-2 py-1 text-sm font-bold text-green-500">{stat.change}</span>
            </div>
            <h3 className="mb-1 font-medium text-zinc-500">{stat.label}</h3>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="glass-card rounded-3xl p-8 lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <button className="flex items-center gap-1 text-sm font-bold text-gold-500 hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-6">
            {[
              { id: "#8234", items: "Vanilla Latte, Almond Croissant", status: "Preparing", time: "5m ago" },
              { id: "#8233", items: "Cold Brew, Avocado Toast", status: "Pending", time: "12m ago" },
              { id: "#8232", items: "Matcha Latte", status: "Ready", time: "18m ago" },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl p-4 transition-all hover:bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-xs font-bold text-zinc-500">
                    {order.id}
                  </div>
                  <div>
                    <h4 className="font-bold">{order.items}</h4>
                    <p className="text-xs text-zinc-500">{order.time}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                    order.status === "Ready"
                      ? "bg-green-500/10 text-green-500"
                      : order.status === "Preparing"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-gold-500/10 text-gold-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <h2 className="mb-8 text-2xl font-bold">Popular Items</h2>
          <div className="space-y-6">
            {[
              { name: "Caramel Macchiato", sales: 145, image: "https://images.unsplash.com/photo-1485808191679-5f6333c1d181?q=80&w=100&auto=format&fit=crop" },
              { name: "Blueberry Muffin", sales: 98, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=100&auto=format&fit=crop" },
              { name: "Iced Americano", sales: 86, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=100&auto=format&fit=crop" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold">{item.name}</h4>
                  <p className="text-xs text-zinc-500">{item.sales} sold this week</p>
                </div>
                <div className="h-1 w-12 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full bg-gold-500" style={{ width: `${(item.sales / 150) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
