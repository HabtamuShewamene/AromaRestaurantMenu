"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  DollarSign,
  Users,
  RefreshCw,
  X,
  Lock,
} from "lucide-react";

export default function BillingManager() {
  const [tables, setTables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [sessionBill, setSessionBill] = useState<any | null>(null);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [payMethod, setPayMethod] = useState<"CASH" | "CARD" | "DIGITAL">("CASH");
  const [payAmount, setPayAmount] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [isSettling, setIsSettling] = useState(false);

  const loadTables = useCallback(async () => {
    try {
      const res = await fetch("/api/tables");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setTables(data);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadTables();
      setIsLoading(false);
    };
    void init();
  }, [loadTables]);

  const openSessionBilling = async (session: any) => {
    setSelectedSession(session);
    setIsBillingLoading(true);
    try {
      const res = await fetch(`/api/payments?tableSessionId=${session.id}`);
      const data = await res.json();
      if (res.ok) {
        setSessionBill(data);
        setPayAmount(data.remainingBalance);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBillingLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedSession || payAmount <= 0) return;
    setIsSettling(true);
    try {
      // 1. Create payment
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableSessionId: selectedSession.id,
          amount: payAmount,
          method: payMethod,
        }),
      });
      const payment = await res.json();

      // 2. Mark completed
      if (payment.id) {
        await fetch("/api/payments", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: payment.id }),
        });
      }

      // 3. Reload bill & tables
      const billRes = await fetch(`/api/payments?tableSessionId=${selectedSession.id}`);
      const updatedBill = await billRes.json();
      setSessionBill(updatedBill);
      setPayAmount(updatedBill.remainingBalance);
      await loadTables();

      setMessage(`Payment of $${payAmount.toFixed(2)} (${payMethod}) recorded successfully!`);
      setTimeout(() => setMessage(""), 3500);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsSettling(false);
    }
  };

  const activeSessions = tables
    .filter((t) => t.tableSessions && t.tableSessions.length > 0)
    .map((t) => ({
      ...t.tableSessions[0],
      tableNumber: t.number,
      tableLabel: t.label,
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
            Billing & Payment Settlement
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Review active table checks, record cash/card/digital payments, and settle running tabs.
          </p>
        </div>

        <button
          onClick={() => loadTables()}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Sessions</span>
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4 text-sm text-gold-300">
          {message}
        </div>
      )}

      {/* Active Table Sessions Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-zinc-500">Loading active table bills...</div>
      ) : activeSessions.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-zinc-400 space-y-2">
          <Receipt className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="font-semibold text-white">No active tables to bill</p>
          <p className="text-xs text-zinc-500">When customers place orders from tables, their running tab will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeSessions.map((session) => {
            const orders = session.orders || [];
            const totalAmount = orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
            const paid = (session.payments || [])
              .filter((p: any) => p.status === "COMPLETED")
              .reduce((sum: number, p: any) => sum + p.amount, 0);
            const balance = Math.max(0, totalAmount - paid);

            return (
              <div
                key={session.id}
                className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-gold-400 font-bold uppercase tracking-wider block">
                        Table {session.tableNumber}
                      </span>
                      <h3 className="text-xl font-bold text-white font-playfair">
                        {session.tableLabel || `Table ${session.tableNumber}`}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-400">
                      {orders.length} order{orders.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Total Running Check:</span>
                      <span className="font-mono font-bold text-white text-sm">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Paid Amount:</span>
                      <span className="font-mono text-green-400">
                        ${paid.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/5 font-bold">
                      <span className="text-zinc-300">Remaining Due:</span>
                      <span className="font-mono text-gold-400 text-base">
                        ${balance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openSessionBilling(session)}
                  className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(182,141,64,0.25)]"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Bill & Settle Payment</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Settle Bill Modal */}
      {selectedSession && sessionBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="bg-[#111111] border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                  Table {sessionBill.tableNumber}
                </span>
                <h3 className="text-xl font-bold text-white font-playfair">
                  Table Settlement Bill
                </h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Orders Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Session Orders ({sessionBill.orders?.length || 0})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {sessionBill.orders?.map((order: any) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl bg-zinc-950 border border-white/5 flex justify-between items-center text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        Order #{order.id.slice(-6).toUpperCase()}{" "}
                        <span className="text-zinc-500 font-normal">
                          ({order.items?.length || 0} items)
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-gold-400">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Total Bill Amount:</span>
                <span className="font-mono font-bold text-white">${sessionBill.totalBill.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Total Paid:</span>
                <span className="font-mono text-green-400">${sessionBill.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5 font-bold text-sm">
                <span className="text-white">Remaining Balance:</span>
                <span className="font-mono text-gold-400 text-lg">
                  ${sessionBill.remainingBalance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Recording Form */}
            {sessionBill.remainingBalance > 0 ? (
              <div className="space-y-4 pt-2 border-t border-white/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Record Settlement Payment
                </h4>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "CASH", label: "Cash", icon: Banknote },
                    { id: "CARD", label: "Card", icon: CreditCard },
                    { id: "DIGITAL", label: "Digital", icon: Smartphone },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = payMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayMethod(m.id as any)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-gold-500/20 border-gold-500 text-gold-300 shadow-[0_0_12px_rgba(182,141,64,0.2)]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Amount input */}
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-medium">
                    Payment Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={payAmount}
                    onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-lg font-mono font-bold text-white outline-none focus:border-gold-500"
                  />
                </div>

                <button
                  disabled={isSettling || payAmount <= 0}
                  onClick={handleRecordPayment}
                  className="w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-400 font-bold text-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(34,197,94,0.3)]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSettling ? "Recording Payment..." : `Confirm Payment • $${payAmount.toFixed(2)}`}</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-green-400" />
                <p className="font-bold text-sm">Table Fully Settled</p>
                <p className="text-xs text-green-300/80">Remaining balance is $0.00.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
