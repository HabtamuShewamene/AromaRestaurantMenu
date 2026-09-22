"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, X, CheckCircle2, Droplets, Utensils, HelpCircle, Loader2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export default function TableActionBar() {
  const { tableContext } = useCart();
  const [showWaiterModal, setShowWaiterModal] = useState(false);
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(139,212,63,0.15)]"
            >
              <BellRing className="w-4 h-4 text-primary" />
              <span>Call Waiter</span>
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
              className="w-full max-w-md bg-[#242424] border border-[#3A3D40] rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#3A3D40] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <BellRing className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#F7F7F2] text-lg">Call Waiter</h3>
                    <p className="text-xs text-[#A7ABB0]">Table {tableContext.tableNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWaiterModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#A7ABB0] hover:text-[#F7F7F2]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {successMessage ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#8BD43F] animate-bounce" />
                  <p className="font-bold text-[#F7F7F2]">{successMessage}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-[#A7ABB0]">How can we help you?</p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedType("CALL_WAITER")}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                        selectedType === "CALL_WAITER"
                          ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                          : "bg-[#111111] border-[#3A3D40] text-[#A7ABB0] hover:border-primary/20"
                      }`}
                    >
                      <BellRing className="w-6 h-6" />
                      <span className="text-xs font-bold">General</span>
                    </button>
                    <button
                      onClick={() => setSelectedType("REQUEST_WATER")}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                        selectedType === "REQUEST_WATER"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-sm"
                          : "bg-[#111111] border-[#3A3D40] text-[#A7ABB0] hover:border-blue-500/20"
                      }`}
                    >
                      <Droplets className="w-6 h-6" />
                      <span className="text-xs font-bold">Water</span>
                    </button>
                    <button
                      onClick={() => setSelectedType("REQUEST_CUTLERY")}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                        selectedType === "REQUEST_CUTLERY"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-sm"
                          : "bg-[#111111] border-[#3A3D40] text-[#A7ABB0] hover:border-amber-500/20"
                      }`}
                    >
                      <Utensils className="w-6 h-6" />
                      <span className="text-xs font-bold">Cutlery</span>
                    </button>
                    <button
                      onClick={() => setSelectedType("CUSTOM")}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                        selectedType === "CUSTOM"
                          ? "bg-white/10 border-white/20 text-[#F7F7F2] shadow-sm"
                          : "bg-[#111111] border-[#3A3D40] text-[#A7ABB0] hover:border-white/10"
                      }`}
                    >
                      <HelpCircle className="w-6 h-6" />
                      <span className="text-xs font-bold">Other</span>
                    </button>
                  </div>

                  {selectedType === "CUSTOM" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
                      <textarea
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        placeholder="E.g., We need some extra napkins..."
                        rows={2}
                        className="w-full bg-[#111111] border border-[#3A3D40] rounded-xl px-4 py-3 text-sm text-[#F7F7F2] placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none transition-all"
                      />
                    </motion.div>
                  )}

                  <div className="pt-4">
                    <button
                      onClick={handleCallWaiter}
                      disabled={isSubmitting || (selectedType === "CUSTOM" && !customNote.trim())}
                      className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-black tracking-widest uppercase hover:bg-[#7bc235] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send Request</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
