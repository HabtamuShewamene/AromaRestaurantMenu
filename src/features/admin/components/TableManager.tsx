"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, QrCode, Ban, Printer, X, Download } from "lucide-react";
import { DiningTableRecord } from "@/shared/types/app";
import { QRCodeSVG } from "qrcode.react";

export default function TableManager() {
  const [tables, setTables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQrTable, setSelectedQrTable] = useState<any | null>(null);

  const loadTables = useCallback(async () => {
    try {
      const res = await fetch("/api/tables");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setTables(data);
      }
    } catch {
      // background silent failure
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setIsLoading(true);
      await loadTables();
      if (isMounted) setIsLoading(false);
    };
    void init();
    return () => { isMounted = false; };
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
      }
    } catch (err) {
      alert("Failed to update table status.");
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 sticky top-0 md:relative z-20 bg-background/95 backdrop-blur-md pt-2 pb-4 border-b border-border md:border-none">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Tables & QR</h1>
          <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
            Manage dining areas and generate QR codes for customer ordering.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-3xl bg-[#242424] animate-pulse" />)}
        </div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-dashed border-[#3A3D40] bg-[#242424]/50">
          <div className="w-16 h-16 rounded-full bg-[#3A3D40] flex items-center justify-center mb-4 text-2xl">🪑</div>
          <h3 className="text-xl font-bold text-[#F7F7F2]">No tables found</h3>
          <p className="text-[#A7ABB0] text-sm mt-2">Tables have not been set up in the database.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-10">
          {tables.map((table) => {
            const activeSession = table.tableSessions?.[0];
            const isOccupied = table.status === "OCCUPIED" || Boolean(activeSession);
            const isOutOfService = table.status === "OUT_OF_SERVICE";
            
            let statusColor = "bg-green-500/10 text-green-500 border-green-500/30";
            let statusText = "Available";
            
            if (isOutOfService) {
              statusColor = "bg-red-500/10 text-red-500 border-red-500/30";
              statusText = "Out of Service";
            } else if (isOccupied) {
              statusColor = "bg-amber-500/10 text-amber-500 border-amber-500/30";
              statusText = "Occupied";
            }

            return (
              <article key={table.id} className="bg-[#242424] rounded-3xl p-3 sm:p-6 flex flex-col justify-between border border-[#3A3D40] transition-colors hover:border-primary/30">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-4 gap-2">
                    <div>
                      <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#A7ABB0] block mb-0.5 sm:mb-1">
                        Table #{table.number}
                      </span>
                      <h3 className="text-sm sm:text-xl font-bold text-[#F7F7F2] line-clamp-1">{table.label || `Table ${table.number}`}</h3>
                    </div>
                    <span className={`self-start sm:self-auto px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full border ${statusColor}`}>
                      {statusText}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs sm:text-sm text-[#A7ABB0] mb-4 sm:mb-6">
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> Capacity: {table.capacity}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-[#3A3D40]">
                  <button 
                    onClick={() => setSelectedQrTable(table)} 
                    className="flex-1 py-1.5 sm:py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-xs sm:text-sm hover:bg-primary hover:text-primary-foreground transition-colors flex justify-center items-center gap-1.5 sm:gap-2"
                  >
                    <QrCode className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Generate QR</span><span className="sm:hidden">QR</span>
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(table.id, table.status)} 
                    className="flex-1 py-1.5 sm:py-2.5 rounded-xl bg-[#111111] text-[#F7F7F2] border border-[#3A3D40] font-bold text-xs sm:text-sm hover:bg-white/5 transition-colors flex justify-center items-center gap-1.5 sm:gap-2"
                  >
                    <Ban className={`w-3 h-3 sm:w-4 sm:h-4 ${isOutOfService ? 'text-[#8BD43F]' : 'text-[#D95C5C]'}`} /> 
                    <span className="hidden sm:inline">{isOutOfService ? "Enable Table" : "Disable Table"}</span>
                    <span className="sm:hidden">{isOutOfService ? "Enable" : "Disable"}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQrTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedQrTable(null)} />
          <div className="relative w-full max-w-sm bg-[#111111] border border-[#3A3D40] rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedQrTable(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-[#A7ABB0] hover:text-[#F7F7F2] hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6 pt-2">
              <h2 className="text-2xl font-black text-[#F7F7F2] mb-1">
                {selectedQrTable.label || `Table ${selectedQrTable.number}`}
              </h2>
              <p className="text-sm text-[#A7ABB0]">Scan to order from this table</p>
            </div>

            <div className="bg-white p-6 rounded-2xl mb-6 mx-auto w-max shadow-inner">
              <QRCodeSVG
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/table/${selectedQrTable.qrIdentifier || selectedQrTable.number}`}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                imageSettings={{
                  src: "/aroma-logo.png",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => window.print()} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-black tracking-wider uppercase hover:bg-[#7bc235] transition-colors flex justify-center items-center gap-2">
                <Printer className="w-5 h-5" /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
