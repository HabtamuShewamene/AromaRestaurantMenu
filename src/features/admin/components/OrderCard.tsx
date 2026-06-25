import { OrderRecord, OrderStatus } from "@/shared/types/app";

type OrderCardProps = {
  order: OrderRecord;
  onStatusChange?: (id: string, status: OrderStatus) => void;
};

const STATUSES: OrderStatus[] = ["pending", "preparing", "ready", "completed", "cancelled"];

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  return (
    <article className="glass-card rounded-3xl p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">#{order.id.slice(-6).toUpperCase()}</p>
          <h3 className="text-xl font-bold">{order.customerName}</h3>
          <p className="text-sm text-zinc-500">{order.customerEmail}</p>
        </div>
        <span className="rounded-full bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-500">{order.status}</span>
      </div>
      <div className="mb-4 space-y-2 text-sm text-zinc-400">
        {order.items.map((item) => (
          <p key={`${order.id}-${item.id}`}>{item.quantity}x {item.name}</p>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-gold-500">${order.totalAmount.toFixed(2)}</span>
        {onStatusChange ? (
          <select
            value={order.status}
            onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}
            className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-2 text-sm outline-none transition-colors hover:border-gold-500 focus:border-gold-500"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleString()}</span>
        )}
      </div>
    </article>
  );
}
