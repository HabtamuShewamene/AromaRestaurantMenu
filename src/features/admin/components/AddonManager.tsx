"use client";

import { useEffect, useState } from "react";
import { MenuItemRecord } from "@/shared/types/app";
import { Plus, X, Pencil, Trash2 } from "lucide-react";

type AddonOption = { id?: string; name: string; price: number; isAvailable: boolean };
type AddonGroup = { id: string; menuItemId: string; name: string; required: boolean; minSelect: number; maxSelect: number; options: AddonOption[]; menuItem: { id: string; name: string } };

export default function AddonManager() {
  const [addons, setAddons] = useState<AddonGroup[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonGroup | null>(null);

  // Form State
  const [menuItemId, setMenuItemId] = useState("");
  const [name, setName] = useState("");
  const [required, setRequired] = useState(false);
  const [minSelect, setMinSelect] = useState("0");
  const [maxSelect, setMaxSelect] = useState("1");
  const [options, setOptions] = useState<AddonOption[]>([{ name: "", price: 0, isAvailable: true }]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [addonsRes, menuRes] = await Promise.all([
          fetch("/api/addons"),
          fetch("/api/menu")
        ]);
        const addonsData = await addonsRes.json();
        const menuData = await menuRes.json();
        if (isMounted) {
          setAddons(Array.isArray(addonsData) ? addonsData : []);
          setMenuItems(Array.isArray(menuData) ? menuData : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void loadData();
    return () => { isMounted = false; };
  }, []);

  const reloadAddons = async () => {
    const res = await fetch("/api/addons");
    const data = await res.json();
    setAddons(Array.isArray(data) ? data : []);
  };

  const openNewForm = () => {
    setEditingAddon(null);
    setMenuItemId("");
    setName("");
    setRequired(false);
    setMinSelect("0");
    setMaxSelect("1");
    setOptions([{ name: "", price: 0, isAvailable: true }]);
    setIsFormOpen(true);
  };

  const openEditForm = (addon: AddonGroup) => {
    setEditingAddon(addon);
    setMenuItemId(addon.menuItemId);
    setName(addon.name);
    setRequired(addon.required);
    setMinSelect(addon.minSelect.toString());
    setMaxSelect(addon.maxSelect.toString());
    setOptions(addon.options.length > 0 ? addon.options : [{ name: "", price: 0, isAvailable: true }]);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAddon(null);
  };

  const handleAddOption = () => {
    setOptions([...options, { name: "", price: 0, isAvailable: true }]);
  };

  const handleUpdateOption = (index: number, field: keyof AddonOption, value: any) => {
    const newOpts = [...options];
    newOpts[index] = { ...newOpts[index], [field]: value };
    setOptions(newOpts);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuItemId) return alert("Please select a menu item.");
    
    // Filter out empty options
    const validOptions = options.filter(o => o.name.trim() !== "");
    if (validOptions.length === 0) return alert("Please add at least one valid option.");

    setIsSaving(true);
    const payload = {
      menuItemId,
      name: name.trim(),
      required,
      minSelect: parseInt(minSelect) || 0,
      maxSelect: parseInt(maxSelect) || 1,
      options: validOptions
    };

    try {
      const res = await fetch(editingAddon ? `/api/addons/${editingAddon.id}` : "/api/addons", {
        method: editingAddon ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save add-on");
      }
      closeForm();
      await reloadAddons();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this add-on group?")) return;
    try {
      const res = await fetch(`/api/addons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await reloadAddons();
    } catch (err) {
      alert("Failed to delete add-on.");
    }
  };

  useEffect(() => {
    if (isFormOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isFormOpen]);

  return (
    <div className="relative min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 sticky top-0 md:relative z-20 bg-background/95 backdrop-blur-md pt-2 pb-4 border-b border-border md:border-none">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Add-ons</h1>
          <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
            Manage custom modifiers for your menu items.
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold tracking-wide uppercase hover:bg-[#7bc235] transition-transform active:scale-95 shadow-[0_4px_14px_rgba(139,212,63,0.3)] w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Create Add-on</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1,2,3,4].map(i => <div key={i} className="h-40 rounded-3xl bg-[#242424] animate-pulse" />)}
        </div>
      ) : addons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-dashed border-[#3A3D40] bg-[#242424]/50">
          <div className="w-16 h-16 rounded-full bg-[#3A3D40] flex items-center justify-center mb-4 text-2xl">
            ✨
          </div>
          <h3 className="text-xl font-bold text-[#F7F7F2]">No add-ons created</h3>
          <p className="text-[#A7ABB0] text-sm max-w-md mt-2 mb-6">
            Create add-ons like "Extra Cheese" or "Milk Choice" and attach them to menu items.
          </p>
          <button onClick={openNewForm} className="px-6 py-2.5 rounded-full bg-white/10 text-[#F7F7F2] font-bold text-sm hover:bg-white/20 transition-colors">
            Create Add-on
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-10">
          {addons.map(addon => (
            <article key={addon.id} className="bg-[#242424] rounded-3xl border border-[#3A3D40] p-3 sm:p-6 flex flex-col justify-between transition-all hover:border-primary/40">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                  <h3 className="text-sm sm:text-lg font-bold text-[#F7F7F2] leading-tight">{addon.name}</h3>
                  <span className={`self-start sm:self-auto px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border ${
                    addon.required ? "bg-amber-500/10 text-amber-500 border-amber-500/30" : "bg-white/5 text-muted-foreground border-border"
                  }`}>
                    {addon.required ? "Required" : "Optional"}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs font-semibold text-primary mb-3 sm:mb-4 line-clamp-1">
                  Attached to: {addon.menuItem?.name || "Unknown Item"}
                </p>
                
                <div className="space-y-1 mb-4 sm:mb-6">
                  {addon.options.slice(0, 3).map(opt => (
                    <div key={opt.id} className="flex items-center justify-between text-[10px] sm:text-sm">
                      <span className="text-[#F7F7F2] truncate mr-2">{opt.name}</span>
                      <span className="text-[#A7ABB0] shrink-0">{opt.price > 0 ? `+${opt.price} ETB` : "Free"}</span>
                    </div>
                  ))}
                  {addon.options.length > 3 && (
                    <div className="text-[9px] sm:text-xs text-muted-foreground pt-1 italic">
                      + {addon.options.length - 3} more options
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5 sm:gap-2 border-t border-[#3A3D40] pt-3 sm:pt-4 mt-auto">
                <button onClick={() => openEditForm(addon)} className="flex-1 py-1.5 sm:py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-xs sm:text-sm hover:bg-primary hover:text-primary-foreground transition-colors flex justify-center items-center gap-1.5">
                  <Pencil className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Edit</span>
                </button>
                <button onClick={() => handleDelete(addon.id)} className="p-1.5 sm:p-2 rounded-xl border border-[#3A3D40] text-[#D95C5C] hover:bg-[#D95C5C]/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] h-full sm:h-auto animate-in slide-in-from-bottom-full md:slide-in-from-bottom-10 md:fade-in duration-300 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col bg-[#111111] md:bg-[#242424] md:border md:border-[#3A3D40] overflow-hidden">
            
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#3A3D40] sticky top-0 bg-[#111111] md:bg-[#242424] z-10">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#F7F7F2]">{editingAddon ? "Edit Add-on" : "Create Add-on"}</h2>
              </div>
              <button onClick={closeForm} className="p-2 rounded-full bg-white/5 text-[#A7ABB0] hover:text-[#F7F7F2] hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <form id="addon-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-[#A7ABB0]">Menu Item *</label>
                    <select value={menuItemId} onChange={e => setMenuItemId(e.target.value)} className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none focus:border-primary" required>
                      <option value="">Select a menu item...</option>
                      {menuItems.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-[#A7ABB0]">Group Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Preparation, Extra Cheese" className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none focus:border-primary" required />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#3A3D40] bg-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-[#F7F7F2]">Selection Rules</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5 flex flex-col justify-end">
                      <button type="button" onClick={() => setRequired(!required)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${required ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-[#111111] border-[#3A3D40] text-[#A7ABB0]"}`}>
                        <span className="font-bold text-sm">{required ? "Required" : "Optional"}</span>
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A7ABB0]">Min Select</label>
                      <input type="number" min="0" value={minSelect} onChange={e => setMinSelect(e.target.value)} className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A7ABB0]">Max Select</label>
                      <input type="number" min="1" value={maxSelect} onChange={e => setMaxSelect(e.target.value)} className="w-full rounded-xl border border-[#3A3D40] bg-[#111111] px-4 py-3 text-sm text-[#F7F7F2] outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#F7F7F2]">Options</h3>
                    <button type="button" onClick={handleAddOption} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                      <Plus className="w-3 h-3" /> Add Option
                    </button>
                  </div>
                  
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input value={opt.name} onChange={e => handleUpdateOption(idx, 'name', e.target.value)} placeholder="Option name" className="flex-1 rounded-xl border border-[#3A3D40] bg-[#111111] px-3 py-2.5 text-sm text-[#F7F7F2] outline-none focus:border-primary" required />
                      <input type="number" min="0" step="0.01" value={opt.price} onChange={e => handleUpdateOption(idx, 'price', e.target.value)} placeholder="Price" className="w-24 rounded-xl border border-[#3A3D40] bg-[#111111] px-3 py-2.5 text-sm text-[#F7F7F2] outline-none focus:border-primary" />
                      <button type="button" onClick={() => handleRemoveOption(idx)} disabled={options.length === 1} className="p-2.5 rounded-xl text-[#D95C5C] hover:bg-[#D95C5C]/10 disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

              </form>
            </div>

            <div className="p-4 md:p-6 border-t border-[#3A3D40] bg-[#111111] md:bg-[#242424] sticky bottom-0">
              <button type="submit" form="addon-form" disabled={isSaving} className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-black tracking-wide uppercase hover:bg-[#7bc235] transition-colors disabled:opacity-50">
                {isSaving ? "Saving..." : (editingAddon ? "Update Add-on" : "Create Add-on")}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
