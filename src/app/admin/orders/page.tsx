import OrderCard from "@/components/admin/OrderCard";

const orders = [
  {
    id: "#8241",
    customerName: "Maya Carter",
    totalAmount: 18.75,
    status: "PREPARING",
    items: "2x Vanilla Latte, 1x Almond Croissant",
  },
  {
    id: "#8240",
    customerName: "Daniel Kim",
    totalAmount: 11.5,
    status: "READY",
    items: "1x Cold Brew, 1x Blueberry Muffin",
  },
  {
    id: "#8239",
    customerName: "Ava Brooks",
    totalAmount: 26.4,
    status: "PENDING",
    items: "2x Matcha Latte, 2x Honey Toast",
  },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Order Management</h1>
        <p className="text-zinc-500">Track live order status and keep the kitchen line moving.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
