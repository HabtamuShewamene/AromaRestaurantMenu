"use client";

import { useEffect, useState, useCallback } from "react";
import {
  QrCode,
  ExternalLink,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  X,
  Printer,
  Ban,
} from "lucide-react";
import Link from "next/link";
import { DiningTableRecord } from "@/shared/types/app";

export default function TableManager() {
  const [tables, setTables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQrTable, setSelectedQrTable] = useState<any | null>(null);
  const [message, setMessage] = useState("");

  const loadTables = useCallback(async () => {
    try {
      const res = await fetch("/api/tables");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setTables(data);
      }
    } catch {
      // Background poll failure silent
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

  const handleToggleStatus = async (tableId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "OUT_OF_SERVICE" ? "AVAILABLE" : "OUT_OF_SERVICE";
    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: tables.find((t) => t.id === tableId)?.number,
          status: nextStatus,
        }),
      });
      if (res.ok) {
        await loadTables();
        setMessage(`Table status updated to ${nextStatus}.`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
            Tables & QR Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage restaurant dining tables, inspect active visits, and generate QR code endpoints.
          </p>
        </div>

        <button
          onClick={() => loadTables()}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Tables</span>
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4 text-sm text-gold-300">
          {message}
        </div>
      )}

      {/* Tables Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-zinc-500">Loading dining tables...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {tables.map((table) => {
            const activeSession = table.tableSessions?.[0];
            const orders = activeSession?.orders || [];
            const sessionTotal = orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
            const isOccupied = table.status === "OCCUPIED" || Boolean(activeSession);
            const isOutOfService = table.status === "OUT_OF_SERVICE";
            const qrDest = `/table/${table.qrIdentifier || table.number}`;

            return (
              <div
                key={table.id}
                className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                {/* Table Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">
                        Table #{table.number}
                      </span>
                      <h3 className="text-xl font-bold text-white font-playfair">
                        {table.label || `Table ${table.number}`}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isOutOfService
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : isOccupied
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                      }`}
                    >
                      {isOutOfService ? "Out of Service" : isOccupied ? "Occupied" : "Available"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-zinc-500" /> Capacity: {table.capacity}
                    </span>
                    {activeSession && (
                      <span className="text-gold-400 font-semibold">
                        {orders.length} active order{orders.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Active Session Info */}
                {activeSession ? (
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Session Total:</span>
                      <span className="font-mono font-bold text-gold-400 text-sm">
                        ${sessionTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-500 text-[11px]">
                      <span>Opened:</span>
                      <span>{new Date(activeSession.openedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-zinc-950/40 border border-white/5 text-center text-xs text-zinc-600">
                    No active session
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedQrTable(table)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-gold-500/15 hover:text-gold-300 text-zinc-300 text-xs font-semibold transition-all border border-white/5"
                    >
                      <QrCode className="w-3.5 h-3.5 text-gold-400" />
                      <span>View QR</span>
                    </button>

                    <a
                      href={qrDest}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-all border border-white/5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Test Menu</span>
                    </a>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(table.id, table.status)}
                    className="w-full py-2 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1"
                  >
                    <Ban className="w-3 h-3" />
                    <span>{isOutOfService ? "Enable Table" : "Mark Out of Service"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Printable Modal */}
      {selectedQrTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="bg-[#111111] border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base font-playfair">
                Table {selectedQrTable.number} QR Code
              </h3>
              <button
                onClick={() => setSelectedQrTable(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Card Template for Printing */}
            <div
              id="printable-qr"
              className="bg-white p-6 rounded-2xl text-black space-y-3 shadow-lg mx-auto max-w-[260px]"
            >
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600">
                Aroma Restaurant
              </p>
              <h4 className="text-xl font-bold font-playfair">
                Table {selectedQrTable.number}
              </h4>
              <p className="text-xs text-zinc-500 font-medium">
                {selectedQrTable.label || "Scan to view digital menu & order"}
              </p>

              {/* Dynamic QR image */}
              <div className="p-2 border border-zinc-200 rounded-xl inline-block bg-white">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    typeof window !== "undefined"
                      ? `${window.location.origin}/table/${selectedQrTable.qrIdentifier || selectedQrTable.number}`
                      : `/table/${selectedQrTable.number}`
                  )}`}
                  alt={`QR for Table ${selectedQrTable.number}`}
                  className="w-40 h-40 mx-auto"
                />
              </div>

              <p className="text-[10px] text-zinc-400">Scan with phone camera</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-gold-500 font-bold text-black text-xs hover:bg-gold-400 transition-all flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print QR Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
