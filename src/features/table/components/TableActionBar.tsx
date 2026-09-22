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
      {/* Table Banner Header */}
      <div className="pt-20 bg-background/95 border-b border-primary/20 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5 font-playfair">
                Table {tableContext.tableNumber}
                {tableContext.tableLabel && (
                  <span className="text-xs font-normal text-muted-foreground font-sans">
                    • {tableContext.tableLabel}
                  </span>
                )}
              </p>
              <p className="text-[10px] text-primary uppercase tracking-wider font-semibold">
                Dine-in Table Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setShowWaiterModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-brand-300 hover:bg-primary/20 text-[11px] sm:text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(182,141,64,0.1)]"
            >
              <BellRing className="w-3.5 h-3.5 text-primary" />
              <span>Call Waiter</span>
            </button>

            <button
              onClick={() => setShowBillModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-foreground/5 border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/10 text-[11px] sm:text-xs font-semibold transition-all active:scale-95"
            >
              <Receipt className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Request Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Call Waiter Modal */}
      <AnimatePresence>
        {showWaiterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#121212] border border-border rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <BellRing className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Call Waiter</h3>
                    <p className="text-xs text-muted-foreground">Table {tableContext.tableNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWaiterModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {successMessage ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-400 animate-bounce" />
                  <p className="font-semibold text-foreground">{successMessage}</p>
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
                              ? "bg-primary/20 border-primary/50 text-brand-300"
                              : "bg-card border-border text-muted-foreground hover:bg-zinc-800"
                          }`}
                        >
                          <Icon className="w-4 h-4 text-primary" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground font-medium block mb-1.5">
                      Optional note or instructions:
                    </label>
                    <textarea
                      rows={2}
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="e.g., extra napkins, ice with water..."
                      className="w-full bg-card border border-border rounded-xl p-3 text-sm text-foreground placeholder-zinc-600 outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    onClick={handleCallWaiter}
                    className="w-full py-3.5 rounded-2xl bg-primary font-bold text-primary-foreground text-sm hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#121212] border border-border rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Request Bill</h3>
                    <p className="text-xs text-muted-foreground">Table {tableContext.tableNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBillModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {successMessage ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-400 animate-bounce" />
                  <p className="font-semibold text-foreground">{successMessage}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ready for the bill? We will notify our restaurant staff to bring your check to{" "}
                    <strong className="text-primary">Table {tableContext.tableNumber}</strong>.
                  </p>

                  <button
                    disabled={isSubmitting}
                    onClick={handleRequestBill}
                    className="w-full py-3.5 rounded-2xl bg-primary font-bold text-primary-foreground text-sm hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
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
