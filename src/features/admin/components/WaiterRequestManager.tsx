"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BellRing,
  Droplets,
  Utensils,
  Receipt,
  HelpCircle,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { WaiterRequestRecord } from "@/shared/types/app";

const REQUEST_TYPE_INFO: Record<string, { label: string; icon: any; color: string }> = {
  CALL_WAITER: { label: "General Assistance", icon: HelpCircle, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  REQUEST_WATER: { label: "Water Refill", icon: Droplets, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  REQUEST_CUTLERY: { label: "Extra Cutlery", icon: Utensils, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  REQUEST_BILL: { label: "Bill Requested", icon: Receipt, color: "text-green-400 bg-green-500/10 border-green-500/30" },
  CUSTOM: { label: "Custom Request", icon: BellRing, color: "text-primary bg-primary/10 border-primary/30" },
};

export default function WaiterRequestManager() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/waiter");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setRequests(data);
      }
    } catch {
      // background silent
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadRequests();
      setIsLoading(false);
    };
    void init();
  }, [loadRequests]);

  // Live polling every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      setIsRefreshing(true);
      await loadRequests();
      setIsRefreshing(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  const updateStatus = async (id: string, status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED") => {
    try {
      const res = await fetch("/api/waiter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await loadRequests();
        setMessage(`Request marked as ${status}.`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-playfair">
              Waiter & Table Assistance
            </h1>
            {isRefreshing && <RefreshCw className="w-4 h-4 text-primary animate-spin" />}
          </div>
          <p className="text-muted-foreground text-sm">
            Real-time feed of guest service calls, water refills, cutlery, and bill requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
            <BellRing className="w-4 h-4" />
            <span>{pendingCount} Pending Call{pendingCount !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-brand-300">
          {message}
        </div>
      )}

      {/* Requests List */}
      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground space-y-2">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
          <p className="font-semibold text-foreground">All caught up!</p>
          <p className="text-xs text-muted-foreground">No active waiter requests right now. New calls will appear automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {requests.map((req) => {
            const typeInfo = REQUEST_TYPE_INFO[req.type] || REQUEST_TYPE_INFO.CUSTOM;
            const Icon = typeInfo.icon;
            const tableNum = req.table?.number || "Unknown";

            return (
              <div
                key={req.id}
                className="glass-card rounded-3xl p-6 border border-border space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider block">
                        Table {tableNum} {req.table?.label ? `• ${req.table.label}` : ""}
                      </span>
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mt-0.5">
                        <Icon className="w-4 h-4 text-primary" />
                        <span>{typeInfo.label}</span>
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                          : req.status === "IN_PROGRESS"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  {req.note && (
                    <div className="p-3 rounded-xl bg-card border border-border text-xs text-muted-foreground italic">
                      "{req.note}"
                    </div>
                  )}

                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Requested {new Date(req.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-border grid grid-cols-2 gap-2">
                  {req.status === "PENDING" && (
                    <button
                      onClick={() => updateStatus(req.id, "IN_PROGRESS")}
                      className="py-2.5 px-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold text-xs hover:bg-blue-500/30 transition-all"
                    >
                      Attending
                    </button>
                  )}

                  <button
                    onClick={() => updateStatus(req.id, "RESOLVED")}
                    className={`py-2.5 px-3 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 font-bold text-xs hover:bg-green-500/30 transition-all ${
                      req.status !== "PENDING" ? "col-span-2" : ""
                    }`}
                  >
                    Mark Resolved ✓
                  </button>

                  {req.status === "PENDING" && (
                    <button
                      onClick={() => updateStatus(req.id, "CANCELLED")}
                      className="py-2.5 px-3 rounded-xl bg-foreground/5 text-muted-foreground font-semibold text-xs hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
