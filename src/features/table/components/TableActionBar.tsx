"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, Receipt, X, CheckCircle2, Droplets, Utensils, HelpCircle, Loader2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export default function TableActionBar() {
  const { tableContext } = useCart();
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedType, setSelectedType] = useState<"CALL_WAITER" | "REQUEST_WATER" | "REQUEST_CUTLERY" | "CUSTOM">("CALL_WAITER");
  const [customNote, setCustomNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!tableContext) return null;

  const handleCallWaiter = async () => {
    setIsSubmitting(true);
    setSuccessMessage("");
    try {
      const res = await fetch("/api/waiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: tableContext.tableId,
          tableSessionId: tableContext.tableSessionId,
          type: selectedType,
          note: customNote || undefined,
        }),
      });

      if (res.ok) {
        setSuccessMessage("Your request has been sent! Our staff is on the way.");
        setTimeout(() => {
          setShowWaiterModal(false);
          setSuccessMessage("");
          setCustomNote("");
        }, 2200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestBill = async () => {
    setIsSubmitting(true);
    setSuccessMessage("");
    try {
      const res = await fetch("/api/waiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: tableContext.tableId,
          tableSessionId: tableContext.tableSessionId,
          type: "REQUEST_BILL",
          note: "Customer requested the bill at Table " + tableContext.tableNumber,
        }),
      });

      if (res.ok) {
        setSuccessMessage("Bill requested! The server will bring your receipt shortly.");
        setTimeout(() => {
          setShowBillModal(false);
          setSuccessMessage("");
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Sticky Table Banner Header */}
      <div className="sticky top-20 z-40 bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-gold-500/20 px-4 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-playfair">
                Table {tableContext.tableNumber}
                {tableContext.tableLabel && (
                  <span className="text-[11px] font-normal text-zinc-400 font-sans">
                    • {tableContext.tableLabel}
                  </span>
                )}
              </p>
              <p className="text-[10px] text-gold-400 uppercase tracking-wider font-semibold">
                Dine-in Active Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWaiterModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(182,141,64,0.1)]"
            >
              <BellRing className="w-3.5 h-3.5 text-gold-400" />
              <span>Call Waiter</span>
            </button>

            <button
              onClick={() => setShowBillModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all active:scale-95"
            >
              <Receipt className="w-3.5 h-3.5 text-zinc-400" />
              <span>Request Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Call Waiter Modal */}
      <AnimatePresence>
        {showWaiterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                    <BellRing className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Call Waiter</h3>
                    <p className="text-xs text-zinc-400">Table {tableContext.tableNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWaiterModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {successMessage ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-400 animate-bounce" />
                  <p className="font-semibold text-white">{successMessage}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "CALL_WAITER", label: "General Help", icon: HelpCircle },
                      { id: "REQUEST_WATER", label: "Water Refill", icon: Droplets },
                      { id: "REQUEST_CUTLERY", label: "Extra Cutlery", icon: Utensils },
                      { id: "CUSTOM", label: "Custom Note", icon: BellRing },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedType(item.id as any)}
                          className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-gold-500/20 border-gold-500/50 text-gold-300"
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                          }`}
                        >
                          <Icon className="w-4 h-4 text-gold-400" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 font-medium block mb-1.5">
                      Optional note or instructions:
                    </label>
                    <textarea
                      rows={2}
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="e.g., extra napkins, ice with water..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold-500"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    onClick={handleCallWaiter}
                    className="w-full py-3.5 rounded-2xl bg-gold-500 font-bold text-black text-sm hover:bg-gold-400 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Notifying Staff...</span>
                      </>
                    ) : (
                      <span>Send Request</span>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Request Bill Modal */}
      <AnimatePresence>
        {showBillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Request Bill</h3>
                    <p className="text-xs text-zinc-400">Table {tableContext.tableNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBillModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {successMessage ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-400 animate-bounce" />
                  <p className="font-semibold text-white">{successMessage}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Ready to settle your dining check? We will notify the staff to print and bring your bill to{" "}
                    <strong className="text-gold-400">Table {tableContext.tableNumber}</strong>.
                  </p>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Payment methods supported:</span>
                      <span className="text-zinc-200 font-medium">Cash • Card • Digital</span>
                    </div>
                  </div>

                  <button
                    disabled={isSubmitting}
                    onClick={handleRequestBill}
                    className="w-full py-3.5 rounded-2xl bg-gold-500 font-bold text-black text-sm hover:bg-gold-400 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <span>Confirm & Request Bill</span>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
