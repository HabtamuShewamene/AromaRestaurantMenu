"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  ChefHat,
  Clock,
  Volume2,
  VolumeX,
  RefreshCw,
  CheckCircle2,
  Flame,
  Bell,
  MessageSquare,
  Shield,
  Store,
  Check,
  AlertCircle,
  Timer,
  Utensils,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { OrderRecord } from "@/shared/types/app";

// Synthesized dual-tone pleasant kitchen chime
function playKitchenChime() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.15);
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.75);
  } catch (err) {
    console.warn("Audio chime prevented by browser autoplay policy:", err);
  }
}

// Format elapsed time (e.g. "3m ago", "1h 12m ago")
function formatElapsedTime(dateString: string, now: Date) {
  const diffMs = now.getTime() - new Date(dateString).getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);

  if (diffMin < 1) return "Just now";
  if (diffHours < 1) return `${diffMin}m ago`;
  const remainingMin = diffMin % 60;
  return `${diffHours}h ${remainingMin}m ago`;
}

function getMinutesElapsed(dateString: string, now: Date) {
  return Math.floor((now.getTime() - new Date(dateString).getTime()) / 60000);
}

// Status priority for sorting: NEW -> CONFIRMED -> PREPARING -> READY
function getStatusPriority(status: string) {
  const norm = status.toUpperCase();
  if (norm === "NEW" || norm === "PENDING") return 1;
  if (norm === "CONFIRMED") return 2;
  if (norm === "PREPARING") return 3;
  if (norm === "READY") return 4;
  return 5;
}

type FilterType = "ALL" | "NEW" | "CONFIRMED" | "PREPARING" | "READY";

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);

  const seenOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  // Initialize sound preferences
  useEffect(() => {
    const saved = localStorage.getItem("kds_sound_enabled");
    if (saved !== null) {
      setSoundEnabled(saved === "true");
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("kds_sound_enabled", String(next));
      if (next) {
        playKitchenChime();
      }
      return next;
    });
  };

  // Live digital clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch kitchen orders
  const fetchOrders = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);
    try {
      const res = await fetch("/api/kitchen/orders");
      if (!res.ok) throw new Error("Failed to fetch kitchen orders");
      const data: OrderRecord[] = await res.json();

      // Check for genuinely new orders to trigger sound/visual alert
      if (!isInitialLoadRef.current) {
        const brandNewOrders = data.filter(
          (o) =>
            (o.status.toUpperCase() === "NEW" || o.status.toUpperCase() === "PENDING") &&
            !seenOrderIdsRef.current.has(o.id)
        );

        if (brandNewOrders.length > 0) {
          const first = brandNewOrders[0];
          const tableText = first.tableNumber ? `Table ${first.tableNumber}` : "Takeaway";
          const ref = first.id.slice(-6).toUpperCase();
          setNewOrderAlert(`New Order #${ref} • ${tableText}`);

          if (soundEnabled) {
            playKitchenChime();
          }

          setTimeout(() => setNewOrderAlert(null), 6000);
        }
      }

      // Update seen order IDs set
      data.forEach((o) => seenOrderIdsRef.current.add(o.id));
      isInitialLoadRef.current = false;

      setOrders(data);
    } catch (err) {
      console.error("Error fetching kitchen orders:", err);
    } finally {
      setIsLoading(false);
      if (manual) setIsRefreshing(false);
    }
  }, [soundEnabled]);

  // Polling interval (every 5 seconds)
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Handle kitchen order status updates
  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    setActionInProgress(orderId);
    try {
      const res = await fetch("/api/kitchen/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: nextStatus }),
      });

      if (res.ok) {
        await fetchOrders();
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setActionInProgress(null);
    }
  };

  // Sort orders: Status priority (NEW -> CONFIRMED -> PREPARING -> READY), then FIFO (oldest first)
  const sortedOrders = [...orders].sort((a, b) => {
    const pA = getStatusPriority(a.status);
    const pB = getStatusPriority(b.status);
    if (pA !== pB) return pA - pB;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Filter orders
  const filteredOrders = sortedOrders.filter((o) => {
    if (activeFilter === "ALL") return true;
    const norm = o.status.toUpperCase();
    if (activeFilter === "NEW") return norm === "NEW" || norm === "PENDING";
    return norm === activeFilter;
  });

  // Counters
  const counts = {
    ALL: orders.length,
    NEW: orders.filter((o) => o.status.toUpperCase() === "NEW" || o.status.toUpperCase() === "PENDING").length,
    CONFIRMED: orders.filter((o) => o.status.toUpperCase() === "CONFIRMED").length,
    PREPARING: orders.filter((o) => o.status.toUpperCase() === "PREPARING").length,
    READY: orders.filter((o) => o.status.toUpperCase() === "READY").length,
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col font-sans select-none">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 bg-[#0c0c0c] border-b border-white/10 px-4 sm:px-6 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Brand & KDS Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/aroma-logo.png?v=3" alt="Aroma Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-playfair leading-none">
                AROMA
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-gold-500 text-black font-extrabold text-[10px] tracking-widest uppercase">
                KDS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-semibold mt-0.5">
              Kitchen Display System
            </p>
          </div>
        </div>

        {/* Live Clock & Connection Status */}
        <div className="flex items-center gap-4 text-xs">
          {/* Digital Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>

          {/* Connection Pulse */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium text-[11px]">Live Sync (5s)</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              soundEnabled
                ? "bg-gold-500/15 border-gold-500/30 text-gold-300 hover:bg-gold-500/25"
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
            title={soundEnabled ? "Audio chime active" : "Audio chime muted"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-gold-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{soundEnabled ? "Sound ON" : "Muted"}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition-all disabled:opacity-50"
            title="Refresh kitchen orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold-400 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          {/* Links to Admin / Storefront */}
          <div className="hidden lg:flex items-center gap-1 border-l border-white/10 pl-2">
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white text-xs font-medium transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-gold-400" />
              <span>Admin</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white text-xs font-medium transition-all"
            >
              <Store className="w-3.5 h-3.5 text-zinc-400" />
              <span>Menu</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── New Order Visual Notification Banner ── */}
      {newOrderAlert && (
        <div className="bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 text-black px-4 py-2.5 text-center font-bold text-sm shadow-xl flex items-center justify-center gap-2 animate-bounce">
          <Bell className="w-4 h-4 animate-ping" />
          <span>🔔 {newOrderAlert}</span>
        </div>
      )}

      {/* ── Filters & Summary Bar ── */}
      <div className="bg-[#0f0f0f] border-b border-white/5 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: "ALL", label: "All Active", count: counts.ALL },
            { id: "NEW", label: "New", count: counts.NEW, badgeColor: "bg-amber-500 text-black" },
            { id: "CONFIRMED", label: "Confirmed", count: counts.CONFIRMED, badgeColor: "bg-sky-500 text-black" },
            { id: "PREPARING", label: "Preparing", count: counts.PREPARING, badgeColor: "bg-orange-500 text-black" },
            { id: "READY", label: "Ready", count: counts.READY, badgeColor: "bg-emerald-500 text-black" },
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as FilterType)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? "bg-gold-500 text-black shadow-[0_2px_12px_rgba(182,141,64,0.4)] scale-105"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isSelected ? "bg-black text-white" : tab.badgeColor || "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Summary Badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span className="text-amber-400 font-bold">{counts.NEW} New</span>
          <span>•</span>
          <span className="text-orange-400 font-bold">{counts.PREPARING} Cooking</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">{counts.READY} Ready</span>
        </div>
      </div>

      {/* ── Main Kitchen Grid Board ── */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-zinc-900/60 border border-white/5 animate-pulse p-5 space-y-4"
              >
                <div className="h-6 bg-zinc-800 rounded-lg w-1/2" />
                <div className="h-10 bg-zinc-800 rounded-xl" />
                <div className="space-y-2 pt-4">
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-4 bg-zinc-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-4xl shadow-2xl">
              🍳
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-playfair">Kitchen is All Clear</h2>
              <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">
                No orders currently require kitchen attention. New guest orders will appear automatically.
              </p>
            </div>
            <button
              onClick={() => fetchOrders(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold-400" />
              <span>Check for Orders</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredOrders.map((order) => {
              const statusNorm = order.status.toUpperCase();
              const isNew = statusNorm === "NEW" || statusNorm === "PENDING";
              const isConfirmed = statusNorm === "CONFIRMED";
              const isPreparing = statusNorm === "PREPARING";
              const isReady = statusNorm === "READY";

              const minutesElapsed = getMinutesElapsed(order.createdAt, currentTime);
              const isUrgent = minutesElapsed >= 15;
              const orderRef = order.id.slice(-6).toUpperCase();

              // Border and styling theme per status
              const cardBorder = isNew
                ? "border-amber-500/60 shadow-[0_0_24px_rgba(245,158,11,0.2)] bg-[#120f08]"
                : isConfirmed
                ? "border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.15)] bg-[#091118]"
                : isPreparing
                ? "border-orange-500/60 shadow-[0_0_24px_rgba(249,115,22,0.2)] bg-[#140c06]"
                : "border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.2)] bg-[#07130c]";

              return (
                <div
                  key={order.id}
                  className={`rounded-3xl border flex flex-col justify-between overflow-hidden transition-all duration-300 ${cardBorder}`}
                >
                  {/* ── Card Header ── */}
                  <div className="p-4 sm:p-5 border-b border-white/10 space-y-3">
                    {/* Top Row: Order # and Elapsed Timer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-white/10 text-zinc-300">
                          #{orderRef}
                        </span>
                        {isNew && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black font-extrabold text-[10px] tracking-wider uppercase animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>

                      <div
                        className={`flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                          isUrgent
                            ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                            : "bg-black/40 text-zinc-300 border border-white/5"
                        }`}
                      >
                        <Timer className="w-3.5 h-3.5" />
                        <span>{formatElapsedTime(order.createdAt, currentTime)}</span>
                      </div>
                    </div>

                    {/* Table Number High Contrast Banner */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="space-y-0.5">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
                          {order.tableNumber ? `TABLE ${String(order.tableNumber).padStart(2, "0")}` : "TAKEAWAY"}
                        </h3>
                        <p className="text-[11px] text-zinc-400 font-medium">
                          {order.customerName || (order.tableNumber ? `Table ${order.tableNumber} Guest` : "Takeaway Order")}
                        </p>
                      </div>

                      {/* Status Icon */}
                      <div className="flex items-center">
                        {isNew && <Bell className="w-6 h-6 text-amber-400 animate-bounce" />}
                        {isConfirmed && <CheckCircle2 className="w-6 h-6 text-sky-400" />}
                        {isPreparing && <Flame className="w-6 h-6 text-orange-400 animate-pulse" />}
                        {isReady && <Check className="w-6 h-6 text-emerald-400 stroke-[3]" />}
                      </div>
                    </div>
                  </div>

                  {/* ── Order Items List ── */}
                  <div className="p-4 sm:p-5 flex-1 space-y-3.5 overflow-y-auto max-h-[360px] no-scrollbar">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5"
                      >
                        {/* Quantity and Item Name */}
                        <div className="flex items-start gap-2.5">
                          <span className="flex-shrink-0 flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-lg bg-white/10 text-white font-mono font-black text-sm border border-white/15">
                            {item.quantity}×
                          </span>
                          <span className="font-bold text-white text-base leading-snug pt-0.5 flex-1">
                            {item.name}
                          </span>
                        </div>

                        {/* Add-ons & Customizations */}
                        {item.addons && item.addons.length > 0 && (
                          <div className="pl-9 space-y-0.5">
                            {item.addons.map((addon, aIdx) => (
                              <p
                                key={aIdx}
                                className="text-xs font-semibold text-gold-300 flex items-center gap-1.5"
                              >
                                <span className="text-gold-500 font-bold">•</span>
                                <span>{addon.name}</span>
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Item-specific Notes */}
                        {item.notes && (
                          <div className="mt-1 ml-9 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span className="font-medium italic">"{item.notes}"</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Order-level Customer Note */}
                    {order.notes && (
                      <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                        <p className="font-bold uppercase tracking-wider text-[10px] text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Special Order Request
                        </p>
                        <p className="italic font-medium">"{order.notes}"</p>
                      </div>
                    )}
                  </div>

                  {/* ── Card Footer Action CTA ── */}
                  <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40">
                    {isNew && (
                      <button
                        type="button"
                        disabled={actionInProgress === order.id}
                        onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                        className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-black text-sm tracking-wide uppercase shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                        <span>ACCEPT ORDER</span>
                      </button>
                    )}

                    {isConfirmed && (
                      <button
                        type="button"
                        disabled={actionInProgress === order.id}
                        onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                        className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-black font-black text-sm tracking-wide uppercase shadow-[0_4px_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2"
                      >
                        <Flame className="w-5 h-5 stroke-[2.5]" />
                        <span>START PREPARING</span>
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        type="button"
                        disabled={actionInProgress === order.id}
                        onClick={() => handleUpdateStatus(order.id, "READY")}
                        className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-black text-sm tracking-wide uppercase shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>MARK READY</span>
                      </button>
                    )}

                    {isReady && (
                      <div className="space-y-2">
                        <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4" /> Ready for Serving
                        </div>
                        <button
                          type="button"
                          disabled={actionInProgress === order.id}
                          onClick={() => handleUpdateStatus(order.id, "SERVED")}
                          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-zinc-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Dismiss (Served)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
