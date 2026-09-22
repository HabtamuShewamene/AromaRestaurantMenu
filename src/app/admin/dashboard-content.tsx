"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderRecord, MenuItemRecord } from "@/shared/types/app";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function AdminDashboardContent() {
  const [dateStr, setDateStr] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    setDateStr(today.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' }));
    
    // Fetch real data
    Promise.all([
      fetch("/api/orders").then(res => res.json()),
      fetch("/api/menu").then(res => res.json())
    ]).then(([ordersData, menuData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setMenuItems(Array.isArray(menuData) ? menuData : []);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  const newOrdersCount = todayOrders.filter(o => o.status === "NEW").length;
  const preparingOrdersCount = todayOrders.filter(o => o.status === "PREPARING").length;
  const readyOrdersCount = todayOrders.filter(o => o.status === "READY").length;
  const unavailableItemsCount = menuItems.filter(m => !m.isAvailable).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            {dateStr ? `${dateStr} · Operational Overview` : "Loading..."}
          </p>
        </div>
      </div>

      {/* ── Operational Metrics ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard title="NEW ORDERS" value={newOrdersCount} color="text-amber-500" />
        <StatCard title="PREPARING" value={preparingOrdersCount} color="text-blue-500" />
        <StatCard title="READY" value={readyOrdersCount} color="text-green-500" />
        <StatCard title="TOTAL MENU ITEMS" value={menuItems.length} color="text-foreground" />
        <StatCard title="UNAVAILABLE ITEMS" value={unavailableItemsCount} color="text-red-500" />
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-card rounded-3xl p-6 border border-border flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
            <p className="text-sm text-muted-foreground mt-1">Live feed of incoming requests</p>
          </div>
          <Link href="/admin/orders" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl"></div>)}
          </div>
        ) : todayOrders.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-muted-foreground">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No orders yet today</h3>
            <p className="text-sm text-muted-foreground mt-1">When customers place orders, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayOrders.slice(0, 10).map((order) => {
              const time = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const tableText = order.tableNumber ? `Table ${order.tableNumber}` : order.orderType === "TAKEAWAY" ? "Takeaway" : "Unknown Table";
              const itemCount = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
              
              let statusColor = "text-muted-foreground bg-white/5";
              if (order.status === "NEW") statusColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
              else if (order.status === "PREPARING") statusColor = "text-blue-500 bg-blue-500/10 border-blue-500/20";
              else if (order.status === "READY") statusColor = "text-primary bg-primary/10 border-primary/20";
              
              return (
                <Link key={order.id} href="/admin/orders" className="block group">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-border hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs text-muted-foreground">
                        #{order.id.slice(0, 4).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{tableText}</p>
                        <p className="text-xs text-muted-foreground">{itemCount} item{itemCount !== 1 ? 's' : ''} • {time}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${statusColor}`}>
                      {order.status}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className="bg-card p-5 rounded-2xl border border-border flex flex-col justify-between h-32">
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</h3>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
    </div>
  );
}
