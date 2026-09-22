"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, User as UserIcon, Store, Shield } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsClient({ user }: { user: any }) {
  return (
    <div className="min-h-screen pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sticky top-0 md:relative z-20 bg-background/95 backdrop-blur-md pt-2 pb-4 border-b border-border md:border-none">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account and system preferences.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#242424] rounded-3xl p-6 border border-[#3A3D40]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F7F7F2]">{user?.name || "Admin User"}</h2>
              <p className="text-sm text-[#A7ABB0]">{user?.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">System Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#242424] rounded-3xl p-6 border border-[#3A3D40]">
          <h3 className="text-sm font-bold text-[#F7F7F2] uppercase tracking-wider mb-6">Preferences</h3>
          
          <div className="flex items-center justify-between py-4 border-b border-[#3A3D40] last:border-0">
            <div>
              <p className="font-bold text-[#F7F7F2]">Appearance</p>
              <p className="text-xs text-[#A7ABB0] mt-0.5">Toggle between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between py-4 border-b border-[#3A3D40] last:border-0">
            <div>
              <p className="font-bold text-[#F7F7F2]">Restaurant Storefront</p>
              <p className="text-xs text-[#A7ABB0] mt-0.5">View the customer-facing menu</p>
            </div>
            <a href="/" target="_blank" className="p-2 rounded-xl bg-white/5 text-[#A7ABB0] hover:text-[#F7F7F2] hover:bg-white/10 transition-colors">
              <Store className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#242424] rounded-3xl p-6 border border-[#D95C5C]/30">
          <h3 className="text-sm font-bold text-[#D95C5C] uppercase tracking-wider mb-6">Account Actions</h3>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full py-3.5 rounded-xl bg-[#D95C5C]/10 text-[#D95C5C] border border-[#D95C5C]/20 font-black tracking-widest uppercase hover:bg-[#D95C5C] hover:text-white transition-colors flex justify-center items-center gap-2"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
