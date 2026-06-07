"use client";

import AdminLayout from "@/layout/AdminLayout";
import { useCreateRegionHandler, useDeleteRegionHandler, useGetRegionHandler, useUpdateRegionHandler } from "@/modals/RegionModal";
import { Region } from "@/Types/Region/Region";
import { FieldInput, Label } from "@/ui/UI";
import { useEffect, useState } from "react";

type ModalMode = "add" | "edit" | null;

const MOCK: Region[] = [
   { _id: "1", code: "PK", name: "Pakistan", currency: "PKR", description: "Primary market", isActive: true },
   { _id: "2", code: "UAE", name: "United Arab Emirates", currency: "AED", description: "Gulf market", isActive: true },
   { _id: "3", code: "UK", name: "United Kingdom", currency: "GBP", description: "Europe hub", isActive: false },
];

// ── Region Modal ──────────────────────────────────────────────────────────────
function RegionModal({ mode, initial, onClose, onSave, isLoading }: { mode: ModalMode; initial?: Region; onClose: () => void; onSave: (data: Region & { isValidate: boolean }) => void; isLoading: boolean }) {
   const [form, setForm] = useState({
      code: initial?.code ?? "",
      name: initial?.name ?? "",
      currency: initial?.currency ?? "",
      description: initial?.description ?? "",
      isActive: initial?.isActive ?? true,
   });
   const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
   // API Integration will go here
   console.log(initial, "initialinitialinitialinitialinitialinitialinitialinitial");

   const set = (k: string, v: string | boolean) => {
      setForm((p) => ({ ...p, [k]: v }));
      setErrors((p) => ({ ...p, [k]: undefined }));
   };

   const validate = () => {
      const e: typeof errors = {};
      if (!form.code.trim()) e.code = "Code required";
      if (!form.name.trim()) e.name = "Name required";
      if (!form.currency.trim()) e.currency = "Currency required";
      setErrors(e);
      return !Object.keys(e).length;
   };

   const handleSave = async () => {
      if (!validate()) return;

      onSave({ ...form, code: form.code.toUpperCase(), currency: form.currency.toUpperCase(), _id: initial?._id ?? "", isValidate: validate() });
   };

   return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
         <div className="w-full sm:max-w-md bg-staticSecondaryBG sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-[#B8975A]/15">
               <div>
                  <h2 className="font-serif text-[17px] sm:text-[18px] font-semibold text-headingColor tracking-[0.04em]">{mode === "add" ? "Add Region" : "Edit Region"}</h2>
                  <p className="text-[11px] text-[#5E5F60] mt-0.5">{mode === "add" ? "Define a new market region" : `Editing ${initial?.code}`}</p>
               </div>
               <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5E5F60] hover:text-headingColor hover:bg-[#B8975A]/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                     <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
               </button>
            </div>
            <div className="px-5 sm:px-6 py-4 sm:py-5 flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                     <Label>Code * (e.g. PK)</Label>
                     <FieldInput value={form.code} onChange={(v) => set("code", v.toUpperCase())} placeholder="PK" error={errors.code} maxLength={6} />
                  </div>
                  <div>
                     <Label>Currency * (e.g. PKR)</Label>
                     <FieldInput value={form.currency} onChange={(v) => set("currency", v.toUpperCase())} placeholder="PKR" error={errors.currency} maxLength={5} />
                  </div>
               </div>
               <div>
                  <Label>Region Name *</Label>
                  <FieldInput value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Pakistan" error={errors.name} />
               </div>
               <div>
                  <Label>Description</Label>
                  <textarea
                     value={form.description}
                     onChange={(e) => set("description", e.target.value)}
                     placeholder="Optional description..."
                     rows={2}
                     className="w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors resize-none"
                  />
               </div>
               <div className="flex items-center justify-between py-2 px-3.5 bg-[#F5F0E8] rounded-lg border border-[#B8975A]/15">
                  <div>
                     <p className="text-[13px] font-medium text-headingColor">Active</p>
                     <p className="text-[10px] text-[#5E5F60]">Inactive regions hidden from pricing</p>
                  </div>
                  <button onClick={() => set("isActive", !form.isActive)} className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${form.isActive ? "bg-[#B8975A]" : "bg-[#5E5F60]/30"}`}>
                     <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isActive ? "-translate-x-4.5" : "translate-x-0.5"}`} />
                  </button>
               </div>
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-[#B8975A]/15 flex items-center justify-end gap-3">
               <button onClick={onClose} className="px-5 py-2.5 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor transition-colors">
                  Cancel
               </button>
               <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] font-medium tracking-[0.04em] rounded-lg hover:bg-headingColor transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M2 7l3.5 3.5L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {isLoading ? "Saving..." : mode === "add" ? "Add Region" : "Save Changes"}
               </button>
            </div>
         </div>
      </div>
   );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ region, onClose, onConfirm, isLoading }: { region: Region; onClose: () => void; onConfirm: (id: string) => void; isLoading: boolean }) {
   return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
         <div className="w-full sm:max-w-sm bg-staticSecondaryBG sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 flex flex-col items-center gap-3 text-center">
               <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                     <path d="M7 3h6M3 6h14M5 6l1 11h8l1-11" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </div>
               <h3 className="font-serif text-[17px] font-semibold text-headingColor">Delete Region?</h3>
               <p className="text-[12px] text-[#5E5F60] leading-relaxed">
                  Remove{" "}
                  <span className="font-medium text-headingColor">
                     {region.name} ({region.code})
                  </span>
                  ? This cannot be undone.
               </p>
            </div>
            <div className="px-6 pb-5 flex gap-3">
               <button onClick={onClose} className="flex-1 py-2.5 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor transition-colors">
                  Cancel
               </button>
               <button onClick={() => onConfirm(region._id)} className="flex-1 py-2.5 bg-red-500 text-white text-[12px] font-medium rounded-lg hover:bg-red-600 transition-colors" disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Delete"}
               </button>
            </div>
         </div>
      </div>
   );
}

// ── Region Card (mobile) ──────────────────────────────────────────────────────
function RegionCard({ r, onEdit, onDelete, onToggle }: { r: Region; onEdit: () => void; onDelete: () => void; onToggle: () => void }) {
   return (
      <div className="bg-white rounded-xl border border-[#B8975A]/10 p-4 flex flex-col gap-3">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
               <span className="text-[12px] font-mono font-semibold text-[#B8975A] bg-[#B8975A]/8 px-2.5 py-1 rounded-md">{r.code}</span>
               <span className="text-[13px] font-medium text-headingColor">{r.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
               <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5E5F60] hover:text-[#B8975A] hover:bg-[#B8975A]/10 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                     <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
               <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5E5F60] hover:text-red-500 hover:bg-red-50 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                     <path d="M5 3h4M2 4h10M3.5 4l.7 7.5h5.6L10.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
            </div>
         </div>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <span className="text-[11px] font-mono text-[#5E5F60]">{r.currency}</span>
               {r.description && <span className="text-[11px] text-[#5E5F60]/70 truncate max-w-[140px]">{r.description}</span>}
            </div>
            <button onClick={onToggle} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-colors ${r.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-[#5E5F60]/10 text-[#5E5F60] border border-[#5E5F60]/20"}`}>
               <span className={`w-1.5 h-1.5 rounded-full ${r.isActive ? "bg-emerald-500" : "bg-[#5E5F60]/40"}`} />
               {r.isActive ? "Active" : "Inactive"}
            </button>
         </div>
      </div>
   );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RegionsPage() {
   const [regions, setRegions] = useState<Region[]>([]);
   const [search, setSearch] = useState("");
   const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
   const [modal, setModal] = useState<ModalMode>(null);
   const [editTarget, setEditTarget] = useState<Region | undefined>();
   const [deleteTarget, setDeleteTarget] = useState<Region | undefined>();

   const filtered = regions.filter((r) => {
      const matchSearch = r.code.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase()) || r.currency.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" ? true : filter === "active" ? r.isActive : !r.isActive;
      return matchSearch && matchFilter;
   });

   // -- Create Region API --
   const { handleCreateRegion, isLoading: createLoading } = useCreateRegionHandler();

   // Get Region API will go here
   const { data } = useGetRegionHandler();

   // Update Region API will go here
   const { handleUpdateCategory, isLoading: isUpdating } = useUpdateRegionHandler();

   // Delete Region API will go here
   const { handleDeleteRegion, isLoading: isDeleting } = useDeleteRegionHandler();

   useEffect(() => {
      if (data?.success == true) {
         setRegions(data.regions);
      }
   }, [data]);

   const handleAdd = async (data: Region & { isValidate: boolean }) => {
      if (!data.isValidate || createLoading) return;
      await handleCreateRegion({ form: data, partialFields: true });
      setModal(null);
   };
   const handleEdit = async (data: Region & { isValidate: boolean }) => {
      setRegions((p) => p.map((r) => (r._id === editTarget?._id ? { ...r, ...data } : r)));
      await handleUpdateCategory({ form: data, id: editTarget?._id ?? "", partialFields: true });
      setModal(null);
      setEditTarget(undefined);
   };
   const handleDelete = async (id: string) => {
      await handleDeleteRegion({ id });
      setDeleteTarget(undefined);
      console.log(id);
   };

   const toggleActive = (id: string) => {
      setRegions((p) => p.map((r) => (r._id === id ? { ...r, isActive: !r.isActive } : r)));
      handleUpdateCategory({ form: { isActive: !regions.find((r) => r._id === id)?.isActive }, id, partialFields: true });
   };

   return (
      <AdminLayout>
         <div className="flex-1 bg-[#F5F0E8] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6">
               <div>
                  <h1 className="font-serif text-[18px] sm:text-[22px] font-semibold text-headingColor tracking-[0.02em]">Regions</h1>
                  <p className="text-[11px] text-[#5E5F60] mt-0.5">Admin / Commerce / Regions</p>
               </div>
               <button onClick={() => setModal("add")} className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-primaryBG text-[#B8975A] text-[12px] font-medium tracking-[0.04em] rounded-lg hover:bg-headingColor transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <span className="hidden sm:inline">Add Region</span>
                  <span className="sm:hidden">Add</span>
               </button>
            </div>

            <div className="px-4 sm:px-8 pb-8 flex flex-col gap-4 sm:gap-5">
               {/* Search + filter */}
               <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:max-w-sm">
                     <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E5F60]" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                        <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                     </svg>
                     <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search regions..."
                        className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-white border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/50 transition-colors"
                     />
                  </div>
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                     <div className="flex items-center bg-white border border-[#B8975A]/15 rounded-lg overflow-hidden text-[12px]">
                        {(["all", "active", "inactive"] as const).map((f) => (
                           <button key={f} onClick={() => setFilter(f)} className={`px-3 sm:px-4 py-2.5 capitalize transition-colors ${filter === f ? "bg-primaryBG text-[#B8975A] font-medium" : "text-[#5E5F60] hover:text-headingColor"}`}>
                              {f}
                           </button>
                        ))}
                     </div>
                     <span className="text-[11px] text-[#5E5F60] sm:ml-auto">
                        {filtered.length} region{filtered.length !== 1 ? "s" : ""}
                     </span>
                  </div>
               </div>

               {/* Desktop table */}
               <div className="hidden sm:block bg-white rounded-2xl border border-[#B8975A]/10 overflow-hidden">
                  <div className="grid grid-cols-[80px_1fr_1fr_120px_120px_90px] gap-4 px-5 py-3.5 border-b border-[#B8975A]/10 bg-[#FAF7F2]">
                     {["Code", "Name", "Currency", "Description", "Status", "Action"].map((h) => (
                        <p key={h} className="text-[10px] tracking-widest uppercase text-[#5E5F60] font-medium">
                           {h}
                        </p>
                     ))}
                  </div>
                  {filtered.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-16 text-center">
                        <svg className="text-[#B8975A]/30 mb-3" width="36" height="36" viewBox="0 0 36 36" fill="none">
                           <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="1.5" />
                           <path d="M12 18h12M18 12v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        <p className="text-[13px] text-[#5E5F60]">No regions found</p>
                     </div>
                  ) : (
                     filtered.map((r, i) => (
                        <div key={r._id} className={`grid grid-cols-[80px_1fr_1fr_120px_120px_90px] gap-4 px-5 py-4 items-center transition-colors hover:bg-[#FAF7F2] ${i !== filtered.length - 1 ? "border-b border-[#B8975A]/8" : ""}`}>
                           <span className="text-[12px] font-mono font-semibold text-[#B8975A] bg-[#B8975A]/8 px-2 py-1 rounded-md w-fit">{r.code}</span>
                           <span className="text-[13px] text-headingColor font-medium">{r.name}</span>
                           <span className="text-[12px] font-mono text-[#5E5F60]">{r.currency}</span>
                           <span className="text-[11px] text-[#5E5F60] truncate">{r.description || "—"}</span>
                           <button
                              onClick={() => toggleActive(r._id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium w-fit transition-colors ${r.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" : "bg-[#5E5F60]/10 text-[#5E5F60] border border-[#5E5F60]/20 hover:bg-[#5E5F60]/15"}`}
                           >
                              <span className={`w-1.5 h-1.5 rounded-full ${r.isActive ? "bg-emerald-500" : "bg-[#5E5F60]/40"}`} />
                              {r.isActive ? "Active" : "Inactive"}
                           </button>
                           <div className="flex items-center gap-2">
                              <button
                                 onClick={() => {
                                    setEditTarget(r);
                                    setModal("edit");
                                 }}
                                 className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5E5F60] hover:text-[#B8975A] hover:bg-[#B8975A]/10 transition-colors"
                              >
                                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </button>
                              <button onClick={() => setDeleteTarget(r)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5E5F60] hover:text-red-500 hover:bg-red-50 transition-colors">
                                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M5 3h4M2 4h10M3.5 4l.7 7.5h5.6L10.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </button>
                           </div>
                        </div>
                     ))
                  )}
               </div>

               {/* Mobile cards */}
               <div className="flex flex-col gap-3 sm:hidden">
                  {filtered.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-[#B8975A]/10">
                        <svg className="text-[#B8975A]/30 mb-3" width="32" height="32" viewBox="0 0 36 36" fill="none">
                           <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="1.5" />
                           <path d="M12 18h12M18 12v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        <p className="text-[13px] text-[#5E5F60]">No regions found</p>
                     </div>
                  ) : (
                     filtered.map((r) => (
                        <RegionCard
                           key={r._id}
                           r={r}
                           onEdit={() => {
                              setEditTarget(r);
                              setModal("edit");
                           }}
                           onDelete={() => setDeleteTarget(r)}
                           onToggle={() => toggleActive(r._id)}
                        />
                     ))
                  )}
               </div>

               {/* Summary cards */}
               <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 sm:gap-4">
                  {[
                     { label: "Total", value: regions.length, icon: "M3 7h18M3 12h18M3 17h18" },
                     { label: "Active", value: regions.filter((r) => r.isActive).length, color: "text-emerald-600", icon: "M5 13l4 4L19 7" },
                     { label: "Inactive", value: regions.filter((r) => !r.isActive).length, color: "text-[#5E5F60]", icon: "M18 6L6 18M6 6l12 12" },
                  ].map((s) => (
                     <div key={s.label} className="bg-white rounded-xl border border-[#B8975A]/10 px-3 sm:px-5 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
                        <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-[#B8975A]/8 flex items-center justify-center shrink-0">
                           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-[#B8975A]">
                              <path d={s.icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                        </div>
                        <div>
                           <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[#5E5F60]">{s.label}</p>
                           <p className={`text-[20px] sm:text-[22px] font-serif font-semibold ${s.color ?? "text-headingColor"}`}>{s.value}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {modal === "add" && <RegionModal mode="add" onClose={() => setModal(null)} onSave={handleAdd} isLoading={createLoading} />}
            {modal === "edit" && editTarget && (
               <RegionModal
                  mode="edit"
                  initial={editTarget}
                  onClose={() => {
                     setModal(null);
                     setEditTarget(undefined);
                  }}
                  onSave={handleEdit}
                  isLoading={isUpdating}
               />
            )}
            {deleteTarget && <DeleteModal region={deleteTarget} onClose={() => setDeleteTarget(undefined)} onConfirm={handleDelete} isLoading={isDeleting} />}
         </div>
      </AdminLayout>
   );
}
