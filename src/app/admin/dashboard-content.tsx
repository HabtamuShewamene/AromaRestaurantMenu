"use client";

import Link from "next/link";
import { Plus, QrCode, ChefHat, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminDashboardContent() {
  const { data: session } = useSession();
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const today = new Date();
    setDateStr(today.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-1">
            Good morning, {session?.user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {dateStr ? `${dateStr} · Aroma overview` : "Here is what is happening at Aroma today."}
          </p>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <div className="px-4 py-2 bg-card border border-border rounded-full text-xs font-semibold text-foreground">
            Today
          </div>
        </div>
      </div>

      {/* ── Stats Overview ── */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="TODAY'S ORDERS" 
          value="48" 
          subtext="↑ 12.5%" 
          subtextColor="text-primary"
        />
        <StatCard 
          title="REVENUE" 
          value="24,850" 
          subtext="ETB" 
          subtextColor="text-muted-foreground"
        />
        <StatCard 
          title="ACTIVE TABLES" 
          value="12/18" 
          subtext="67% occupied" 
          subtextColor="text-primary"
        />
        <StatCard 
          title="PENDING REQUESTS" 
          value="7" 
          badge="Attention"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Sales Overview Chart (Mock) ── */}
        <div className="lg:col-span-2 bg-card rounded-3xl p-6 border border-border flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Sales overview</h2>
              <p className="text-xs text-muted-foreground mt-1">Order performance over the last 7 days</p>
            </div>
            <div className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-medium text-muted-foreground">
              This week
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[200px] w-full flex items-end">
            {/* Simple Mock SVG Line Chart */}
            <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
              <path 
                d="M0,80 Q50,75 100,60 T200,50 T300,10 T400,20" 
                fill="none" 
                stroke="#8BD43F" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="drop-shadow-[0_4px_12px_rgba(139,212,63,0.3)]"
              />
            </svg>
            
            {/* X-Axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground/60 transform translate-y-6">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* ── Live Order Queue ── */}
        <div className="bg-card rounded-3xl p-6 border border-border flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Live order queue</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="space-y-3">
            <OrderQueueItem 
              id="#A7F2C" table="Table 4" items={2} time="4 min ago" 
              status="NEW" statusColor="text-amber-500" indicatorColor="bg-amber-500" 
            />
            <OrderQueueItem 
              id="#A7E91" table="Table 8" items={5} time="8 min ago" 
              status="READY" statusColor="text-primary" indicatorColor="bg-primary" 
            />
            <OrderQueueItem 
              id="#A7D38" table="Table 2" items={3} time="12 min ago" 
              status="SERVED" statusColor="text-muted-foreground" indicatorColor="bg-muted-foreground" 
            />
          </div>
        </div>
      </div>

      {/* ── Quick Management ── */}
      <div className="bg-card rounded-3xl p-6 border border-border">
        <h2 className="text-lg font-bold text-foreground mb-1">Quick management</h2>
        <p className="text-xs text-muted-foreground mb-6">Common actions for daily restaurant operations</p>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <QuickAction 
            href="/admin/menu" 
            icon={Plus} 
            title="Add menu item" 
            description="Create a new dish" 
          />
          <QuickAction 
            href="/admin/tables" 
            icon={QrCode} 
            title="Manage tables" 
            description="QR and availability" 
          />
          <QuickAction 
            href="/kitchen" 
            icon={ChefHat} 
            title="Open Kitchen Display" 
            description="Monitor live preparation" 
            isPrimary 
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  subtext, 
  subtextColor, 
  badge 
}: { 
  title: string; 
  value: string | number; 
  subtext?: string; 
  subtextColor?: string;
  badge?: string;
}) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border flex flex-col justify-between h-[100px]">
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">{title}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-extrabold text-foreground">{value}</p>
        {subtext && (
          <p className={`text-xs font-semibold mb-1 ${subtextColor}`}>{subtext}</p>
        )}
        {badge && (
          <div className="px-2.5 py-1 bg-[#D6A84F]/10 text-[#D6A84F] border border-[#D6A84F]/20 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1">
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderQueueItem({
  id, table, items, time, status, statusColor, indicatorColor
}: {
  id: string; table: string; items: number; time: string; status: string; statusColor: string; indicatorColor: string;
}) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-background rounded-xl border border-border">
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${indicatorColor}`} />
        <div>
          <p className="text-sm font-bold text-foreground">{id} - {table}</p>
          <p className="text-[10px] text-muted-foreground">{items} items · {time}</p>
        </div>
      </div>
      <span className={`text-[10px] font-extrabold tracking-widest uppercase ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}

function QuickAction({ 
  href, icon: Icon, title, description, isPrimary 
}: { 
  href: string; icon: any; title: string; description: string; isPrimary?: boolean;
}) {
  return (
    <Link 
      href={href} 
      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
        isPrimary 
        ? "bg-primary text-primary-foreground border-primary hover:bg-[#7bc235]" 
        : "bg-background border-border hover:border-primary/40 hover:bg-foreground/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isPrimary ? "bg-black/10" : "bg-foreground/5"}`}>
          <Icon className={`w-5 h-5 ${isPrimary ? "text-primary-foreground" : "text-primary"}`} />
        </div>
        <div>
          <p className={`text-sm font-bold ${isPrimary ? "text-primary-foreground" : "text-foreground"}`}>{title}</p>
          <p className={`text-[10px] mt-0.5 ${isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{description}</p>
        </div>
      </div>
      {isPrimary && <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
    </Link>
  );
}
