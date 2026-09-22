import { OrderRecord, OrderStatus } from "@/shared/types/app";
import { Utensils, MessageSquare } from "lucide-react";
import Link from "next/link";

type OrderCardProps = {
  order: OrderRecord;
  onStatusChange?: (id: string, status: OrderStatus) => void;
};

const STATUS_LIST: OrderStatus[] = [
  "NEW",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "SERVED",
  "COMPLETED",
  "CANCELLED",
];

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const normStatus = order.status.toUpperCase() as OrderStatus;

  return (
    <article className="glass-card rounded-3xl p-6 border border-border space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">#{order.id.slice(-6).toUpperCase()}</span>
            {order.tableNumber ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold">
                <Utensils className="w-3 h-3" /> Table {order.tableNumber}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-muted-foreground text-xs font-semibold">
                Takeaway
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-foreground">{order.customerName || "Table Guest"}</h3>
          {order.customerPhone && (
            <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
          )}
          {order.customerEmail && (
            <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
          )}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            ["NEW", "PENDING"].includes(String(normStatus))
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : normStatus === "PREPARING"
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : normStatus === "READY"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : ["SERVED", "COMPLETED"].includes(String(normStatus))
              ? "bg-zinc-800 text-muted-foreground"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Items list with add-ons and notes */}
      <div className="space-y-2 py-2 border-t border-b border-border text-sm text-muted-foreground">
        {order.items.map((item, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="flex justify-between">
              <span>
                <strong className="text-primary mr-1.5">{item.quantity}x</strong> {item.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
            {item.addons && item.addons.length > 0 && (
              <div className="text-xs text-muted-foreground ml-5 space-y-0.5">
                {item.addons.map((a, i) => (
                  <p key={i}>
                    + {a.name} {a.price > 0 ? `($${a.price.toFixed(2)})` : ""}
                  </p>
                ))}
              </div>
            )}
            {item.notes && (
              <p className="text-xs text-muted-foreground italic ml-5 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-zinc-600" /> "{item.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div>
          <span className="text-xs text-muted-foreground block">Total</span>
          <span className="font-mono font-bold text-primary text-lg">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/order/${order.id}`}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Track Order
          </Link>

          {onStatusChange ? (
            <select
              value={normStatus}
              onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}
              className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground outline-none transition-colors hover:border-primary focus:border-primary"
            >
              {STATUS_LIST.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</span>
          )}
        </div>
      </div>
    </article>
  );
}
