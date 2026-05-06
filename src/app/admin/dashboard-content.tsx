import Link from "next/link";
import { ArrowRight, BarChart3, ListTree, ShoppingBag, Utensils, Star } from "lucide-react";

const adminCapabilities = [
  {
    title: "Menu Control",
    description: "Add items, update price and descriptions, toggle availability, or delete outdated products.",
    href: "/admin/menu",
    icon: Utensils,
  },
  {
    title: "Categories",
    description: "Manage menu categories like Coffee, Tea, Cold Drinks, and Pastries.",
    href: "/admin/categories",
    icon: ListTree,
  },
  {
    title: "Orders",
    description: "View every client order and move it from pending to completed.",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Analytics",
    description: "Track popular items, revenue, order volume, and status mix across the system.",
    href: "/admin/analytics",
    icon: BarChart3,
    {
      title: "Reviews",
      description: "Moderate customer reviews and manage approval workflow for menu item feedback.",
      href: "/admin/reviews",
      icon: Star,
    },
  },
];

export default function AdminDashboardContent() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="mb-3 text-5xl font-bold">
          Admin <span className="text-gold-500">Control Center</span>
        </h1>
        <p className="max-w-3xl text-lg text-zinc-500">
          This role has full control over menu data, category structure, order workflow, and reporting. Clients can
          browse and order, but only admins can change the system itself.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {adminCapabilities.map((capability) => (
          <Link key={capability.title} href={capability.href} className="glass-card rounded-3xl p-8 transition-colors hover:border hover:border-gold-500/40">
            <div className="mb-6 flex items-center justify-between">
              <div className="rounded-2xl bg-gold-500/10 p-3 text-gold-500">
                <capability.icon className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-500" />
            </div>
            <h2 className="mb-3 text-2xl font-bold">{capability.title}</h2>
            <p className="text-zinc-500">{capability.description}</p>
          </Link>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-8">
        <h2 className="mb-4 text-2xl font-bold">Role Boundary</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gold-500">Admin Can</p>
            <ul className="space-y-2 text-zinc-400">
              <li>Add, edit, hide, and delete menu items</li>
              <li>Create and maintain categories</li>
              <li>View all orders and update their status</li>
              <li>Access analytics and system-wide performance data</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gold-500">Client Cannot</p>
            <ul className="space-y-2 text-zinc-400">
              <li>Modify menu records or pricing</li>
              <li>Change availability or category assignments</li>
              <li>Open admin routes or analytics</li>
              <li>See anyone else&apos;s order history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
