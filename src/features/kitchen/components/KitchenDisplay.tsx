"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { OrderRecord, OrderStatus } from "@/shared/types/app";
import { ChefHat, CheckCircle2, Clock, Volume2, VolumeX, Store, Utensils, AlertCircle } from "lucide-react";
import Link from "next/link";

// Synthesized chime for new orders
function playKitchenChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);
  } catch (err) {
    // browser blocked
  }
}

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const seenOrderIds = useRef<Set<string>>(new Set());
  const isInitialLoad = useRef(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/kitchen/orders");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        if (!isInitialLoad.current) {
          const newOrders = data.filter(o => ["NEW", "PENDING", "CONFIRMED"].includes(o.status) && !seenOrderIds.current.has(o.id));
          if (newOrders.length > 0 && soundEnabled) {
            playKitchenChime();
          }
        }
        
        data.forEach(o => seenOrderIds.current.add(o.id));
        setOrders(data);
        isInitialLoad.current = false;
      }
    } catch {
      // background silent
    }
  }, [soundEnabled]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setIsLoading(true);
      await fetchOrders();
      if (isMounted) setIsLoading(false);
    };
    void init();
    return () => { isMounted = false; };
  }, [fetchOrders]);

  useEffect(() => {
    const interval = setInterval(() => fetchOrders(), 8000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchOrders();
      } else {
        alert("Unable to update order");
      }
    } catch {
      alert("Network error. Try again.");
    }
  };

  const getMinutesElapsed = (dateString: string) => {
    return Math.floor((currentTime.getTime() - new Date(dateString).getTime()) / 60000);
  };

  const activeOrders = orders.filter(o => ["NEW", "PENDING", "CONFIRMED", "PREPARING", "READY"].includes(o.status.toUpperCase()));
  
  const newOrders = activeOrders.filter(o => ["NEW", "PENDING", "CONFIRMED"].includes(o.status.toUpperCase()));
  const preparingOrders = activeOrders.filter(o => o.status.toUpperCase() === "PREPARING");
  const readyOrders = activeOrders.filter(o => o.status.toUpperCase() === "READY");

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#242424] border-b border-[#3A3D40] shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-2 -ml-2 rounded-xl text-[#A7ABB0] hover:text-[#F7F7F2] hover:bg-white/5 transition-colors">
            <Store className="w-5 h-5" />
          </Link>
          <div className="w-px h-6 bg-[#3A3D40]" />
          <h1 className="text-xl font-bold text-[#F7F7F2] flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-primary" /> Kitchen Display
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#111111] rounded-xl border border-[#3A3D40]">
            <Clock className="w-4 h-4 text-primary" />
            <span suppressHydrationWarning className="text-sm font-mono font-bold text-[#F7F7F2]">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
              soundEnabled ? "bg-[#8BD43F]/10 border-[#8BD43F]/30 text-[#8BD43F]" : "bg-white/5 border-[#3A3D40] text-[#A7ABB0]"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-sm font-bold hidden sm:inline">{soundEnabled ? "Sound On" : "Sound Off"}</span>
          </button>
        </div>
      </header>

      {/* Main KDS Grid */}
      <main className="flex-1 p-4 md:p-6 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <div className="w-20 h-20 rounded-full bg-[#242424] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-[#F7F7F2]">Kitchen is clear</h2>
            <p className="text-[#A7ABB0] mt-2 max-w-sm">There are no active orders right now. Good time to prep!</p>
          </div>
        ) : (
          <div className="flex flex-col md:grid md:grid-cols-3 gap-6 min-w-full md:min-w-[900px] h-full items-start pb-10">
            {/* NEW COLUMN */}
            <KDSColumn title="NEW" count={newOrders.length} color="border-amber-500/30">
              {newOrders.map(order => (
                <KDSOrderCard 
                  key={order.id} 
                  order={order} 
                  elapsed={getMinutesElapsed(order.createdAt)} 
                  actionLabel="Accept & Prepare"
                  actionClass="bg-blue-500 text-white hover:bg-blue-600"
                  onAction={() => updateStatus(order.id, "PREPARING")}
                />
              ))}
            </KDSColumn>

            {/* PREPARING COLUMN */}
            <KDSColumn title="PREPARING" count={preparingOrders.length} color="border-blue-500/30">
              {preparingOrders.map(order => (
                <KDSOrderCard 
                  key={order.id} 
                  order={order} 
                  elapsed={getMinutesElapsed(order.createdAt)} 
                  actionLabel="Mark Ready"
                  actionClass="bg-primary text-primary-foreground hover:bg-[#7bc235]"
                  onAction={() => updateStatus(order.id, "READY")}
                />
              ))}
            </KDSColumn>

            {/* READY COLUMN */}
            <KDSColumn title="READY" count={readyOrders.length} color="border-[#8BD43F]/30">
              {readyOrders.map(order => (
                <KDSOrderCard 
                  key={order.id} 
                  order={order} 
                  elapsed={getMinutesElapsed(order.createdAt)} 
                  actionLabel="Complete (Served)"
                  actionClass="bg-[#3A3D40] text-white hover:bg-[#4a4d50]"
                  onAction={() => updateStatus(order.id, "SERVED")}
                />
              ))}
            </KDSColumn>
          </div>
        )}
      </main>
    </div>
  );
}

function KDSColumn({ title, count, color, children }: { title: string, count: number, color: string, children: React.ReactNode }) {
  return (
    <div className={`flex flex-col h-full bg-[#111111] rounded-3xl border-2 ${color} overflow-hidden`}>
      <div className="bg-[#242424] px-4 py-3 border-b border-[#3A3D40] flex items-center justify-between sticky top-0 z-10">
        <h2 className="font-black text-[#F7F7F2] tracking-wider">{title}</h2>
        <span className="w-7 h-7 rounded-full bg-[#111111] text-[#F7F7F2] font-bold text-xs flex items-center justify-center border border-[#3A3D40]">
          {count}
        </span>
      </div>
      <div className="p-3 sm:p-4 flex-1 grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4 overflow-y-auto content-start">
        {children}
      </div>
    </div>
  );
}

function KDSOrderCard({ order, elapsed, actionLabel, actionClass, onAction }: { order: OrderRecord, elapsed: number, actionLabel: string, actionClass: string, onAction: () => void }) {
  const isUrgent = elapsed >= 15;
  const tableText = order.tableNumber ? `Table ${order.tableNumber}` : "Takeaway";

  return (
    <div className={`rounded-2xl p-2.5 sm:p-4 border ${isUrgent ? 'bg-red-500/10 border-red-500/30' : 'bg-[#242424] border-[#3A3D40]'} flex flex-col justify-between h-full`}>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-3 border-b border-[#3A3D40]/50 pb-2 sm:pb-3 gap-2">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <span className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${order.tableNumber ? 'bg-primary/20 text-primary' : 'bg-white/10 text-[#A7ABB0]'}`}>
                {tableText}
              </span>
              <span className="font-mono text-[10px] sm:text-xs font-bold text-[#A7ABB0]">#{order.id.slice(0,4).toUpperCase()}</span>
            </div>
            {order.customerName && <div className="text-[10px] sm:text-sm font-bold text-[#F7F7F2] line-clamp-1">{order.customerName}</div>}
          </div>
          
          <div className={`self-start sm:self-auto flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${isUrgent ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-[#A7ABB0]'}`}>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {elapsed}m
          </div>
        </div>

      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        {order.items.map((item, idx) => (
          <div key={idx}>
            <div className="flex gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-[#F7F7F2]">
              <strong className="text-primary">{item.quantity}x</strong>
              <span className="font-semibold">{item.name}</span>
            </div>
            {item.addons && item.addons.length > 0 && (
              <div className="ml-4 sm:ml-5 mt-0.5 space-y-0.5">
                {item.addons.map((a, i) => (
                  <div key={i} className="text-[9px] sm:text-xs text-[#A7ABB0] leading-tight">
                    + {a.name}
                  </div>
                ))}
              </div>
            )}
            {item.notes && (
              <div className="ml-4 sm:ml-5 mt-1 text-[9px] sm:text-xs text-amber-400 bg-amber-500/10 px-2 py-1.5 rounded-md border border-amber-500/20">
                "{item.notes}"
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={onAction} className={`w-full py-1.5 sm:py-3 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-sm tracking-widest uppercase transition-transform active:scale-95 ${actionClass}`}>
        {actionLabel}
      </button>
    </div>
  );
}
