import { OrderRecord, OrderStatus } from "@/shared/types/app";
import { Utensils, MessageSquare, Clock } from "lucide-react";

type OrderCardProps = {
  order: OrderRecord;
  onUpdateStatus?: (id: string, status: OrderStatus) => void;
};

const STATUS_LIST: OrderStatus[] = [
  "NEW",
  "PREPARING",
  "READY",
  "SERVED",
  "COMPLETED",
  "CANCELLED",
];

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const normStatus = order.status.toUpperCase() as OrderStatus;
  
  let statusColor = "bg-white/5 text-muted-foreground border-[#3A3D40]";
  if (["NEW", "PENDING", "CONFIRMED"].includes(normStatus)) statusColor = "bg-amber-500/10 text-amber-500 border-amber-500/30";
  else if (normStatus === "PREPARING") statusColor = "bg-blue-500/10 text-blue-500 border-blue-500/30";
  else if (normStatus === "READY") statusColor = "bg-[#8BD43F]/10 text-[#8BD43F] border-[#8BD43F]/30";
  else if (normStatus === "CANCELLED") statusColor = "bg-[#D95C5C]/10 text-[#D95C5C] border-[#D95C5C]/30";

  const timeStr = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <article className="bg-[#242424] rounded-3xl p-6 flex flex-col justify-between border border-[#3A3D40] transition-colors hover:border-primary/30">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-black text-[#F7F7F2] font-mono tracking-wider">#{order.id.slice(0, 6).toUpperCase()}</span>
              {order.tableNumber ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-[#3A3D40] text-[#A7ABB0] text-[10px] font-bold uppercase tracking-wider">
                  <Utensils className="w-3 h-3 text-primary" /> Table {order.tableNumber}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-[#3A3D40] text-[#A7ABB0] text-[10px] font-bold uppercase tracking-wider">
                  Takeaway
                </span>
              )}
            </div>
            {order.customerName && (
              <h3 className="text-sm font-bold text-[#F7F7F2]">{order.customerName}</h3>
            )}
            <div className="flex items-center gap-1.5 text-xs text-[#A7ABB0] mt-1">
              <Clock className="w-3.5 h-3.5" /> {timeStr}
            </div>
          </div>

          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${statusColor}`}>
            {order.status}
          </span>
        </div>

        {/* Order Items */}
        <div className="space-y-3 py-4 border-t border-b border-[#3A3D40] mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm text-[#F7F7F2]">
                  <strong className="text-primary mr-2 bg-primary/10 px-1.5 py-0.5 rounded">{item.quantity}x</strong> 
                  {item.name}
                </span>
                <span className="font-mono text-xs font-bold text-[#A7ABB0] whitespace-nowrap mt-0.5">
                  {(item.price * item.quantity).toFixed(2)} ETB
                </span>
              </div>
              
              {item.addons && item.addons.length > 0 && (
                <div className="ml-8 space-y-0.5">
                  {item.addons.map((a, i) => (
                    <div key={i} className="flex justify-between text-xs text-[#A7ABB0]">
                      <span>+ {a.name}</span>
                      {a.price > 0 && <span>{a.price.toFixed(2)} ETB</span>}
                    </div>
                  ))}
                </div>
              )}
              
              {item.notes && (
                <div className="ml-8 mt-1 flex items-start gap-1.5 text-xs text-amber-500/80 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                  <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 
                  <span className="italic leading-snug">"{item.notes}"</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7ABB0] block mb-0.5">Total</span>
          <span className="font-mono font-black text-primary text-xl">
            {order.totalAmount.toFixed(2)} ETB
          </span>
        </div>

        {onUpdateStatus && (
          <select
            value={normStatus}
            onChange={(event) => onUpdateStatus(order.id, event.target.value as OrderStatus)}
            className="rounded-xl border border-[#3A3D40] bg-[#111111] px-3.5 py-2.5 text-xs font-bold text-[#F7F7F2] outline-none transition-all hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/50"
          >
            {STATUS_LIST.map((status) => (
              <option key={status} value={status}>
                Mark as {status}
              </option>
            ))}
          </select>
        )}
      </div>
    </article>
  );
}
