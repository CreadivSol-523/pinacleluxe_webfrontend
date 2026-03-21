import { useCategoryManager } from "@/Validations/CategoryManager/CategoryManager";
import { useEffect, useRef } from "react";

// ── Small helpers ─────────────────────────────────────────────────────────────

export const Label = ({ children }: { children: React.ReactNode }) => <p className="text-[11px] tracking-[0.08em] uppercase text-[#5E5F60] mb-1.5">{children}</p>;

export const FieldInput = ({ value, onChange, placeholder, error }: { value: string; onChange: (v: string) => void; placeholder?: string; error?: string }) => (
   <div>
      <input
         type="text"
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         className={`w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none transition-colors
            ${error ? "border-red-400" : "border-[#B8975A]/20 focus:border-[#B8975A]/60"}`}
      />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
   </div>
);

// ── Toggle switch ─────────────────────────────────────────────────────────────
export const Toggle = ({ active, onChange }: { active: boolean; onChange: () => void }) => (
   <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0
         ${active ? "bg-[#B8975A]" : "bg-[#5E5F60]/30"}`}
   >
      <span
         className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 
            ${active ? "-translate-x-4.5" : "translate-x-0.5"}`}
      />
   </button>
);

// ── Add/Edit Modal ────────────────────────────────────────────────────────────
export function CategoryModal({
   isOpen,
   onClose,
   editingId,
   form,
   errors,
   loading,
   setField,
   handleNameChange,
   handleSubmit,
   topLevelCats,
}: {
   isOpen: boolean;
   onClose: () => void;
   editingId: string | null;
   form: ReturnType<typeof useCategoryManager>["form"];
   errors: ReturnType<typeof useCategoryManager>["errors"];
   loading: boolean;
   setField: ReturnType<typeof useCategoryManager>["setField"];
   handleNameChange: (v: string) => void;
   handleSubmit: () => void;
   topLevelCats: ReturnType<typeof useCategoryManager>["topLevelCats"];
}) {
   const overlayRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
   }, [onClose]);

   if (!isOpen) return null;

   return (
      <div
         ref={overlayRef}
         onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
         }}
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      >
         <div className="w-full max-w-md bg-staticSecondaryBG rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#B8975A]/15">
               <h2 className="font-serif text-[20px] font-semibold text-headingColor tracking-[0.04em]">{editingId ? "Edit Category" : "Add Category"}</h2>
               <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5E5F60] hover:text-headingColor hover:bg-[#B8975A]/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                     <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
               </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">
               {/* Name + Slug */}
               <div>
                  <Label>Name *</Label>
                  <FieldInput value={form.name} onChange={handleNameChange} placeholder="e.g. Tote Bags" error={errors.name} />
               </div>
               <div>
                  <Label>Slug *</Label>
                  <FieldInput value={form.slug} onChange={(v) => setField("slug", v)} placeholder="auto-generated" error={errors.slug} />
               </div>

               {/* Image URL */}
               <div>
                  <Label>Thumbnail Image URL</Label>
                  <FieldInput value={form.image} onChange={(v) => setField("image", v)} placeholder="https://..." error={errors.image} />
                  {form.image && (
                     <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-[#B8975A]/15">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                     </div>
                  )}
               </div>

               {/* Parent category */}
               <div>
                  <Label>Parent Category</Label>
                  <select
                     value={form.parentId ?? ""}
                     onChange={(e) => setField("parentId", e.target.value || null)}
                     className="w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor focus:outline-none focus:border-[#B8975A]/60 transition-colors cursor-pointer"
                  >
                     <option value="">None (Top-level category)</option>
                     {topLevelCats
                        .filter((c) => c.id !== editingId)
                        .map((c) => (
                           <option key={c.id} value={c.id}>
                              {c.name}
                           </option>
                        ))}
                  </select>
               </div>

               {/* Active toggle */}
               <div className="flex items-center justify-between py-1">
                  <div>
                     <p className="text-[13px] font-medium text-headingColor">Active</p>
                     <p className="text-[11px] text-[#5E5F60]">Inactive categories won't appear on the site</p>
                  </div>
                  <Toggle active={form.isActive} onChange={() => setField("isActive", !form.isActive)} />
               </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#B8975A]/15 flex items-center justify-end gap-3">
               <button onClick={onClose} className="px-5 py-2.5 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor transition-colors">
                  Cancel
               </button>
               <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] font-medium tracking-[0.04em] rounded-lg hover:bg-headingColor transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                     <>
                        <svg className="animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none">
                           <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                        </svg>
                        Saving...
                     </>
                  ) : (
                     <>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                           <path d="M2 7l3.5 3.5L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {editingId ? "Update" : "Save Category"}
                     </>
                  )}
               </button>
            </div>
         </div>
      </div>
   );
}
