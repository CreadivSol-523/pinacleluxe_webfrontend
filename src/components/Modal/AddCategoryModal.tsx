import { FieldInput, Label, Toggle } from "@/ui/UI";
import { useCategoryManager } from "@/Validations/CategoryManager/CategoryManager";
import { useEffect, useRef } from "react";

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
   disableParentSelection = false,
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
   disableParentSelection?: boolean;
}) {
   const overlayRef = useRef<HTMLDivElement>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

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
               {/* Name */}
               <div>
                  <Label>Name *</Label>
                  <FieldInput value={form.name} onChange={handleNameChange} placeholder="e.g. Tote Bags" error={errors.name} />
               </div>

               {/* Slug */}
               <div>
                  <Label>Slug *</Label>
                  <FieldInput value={form.slug} onChange={(v) => setField("slug", v)} placeholder="auto-generated" error={errors.slug} />
               </div>

               {/* Image Upload */}
               <div>
                  <Label>Thumbnail Image</Label>

                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/jpeg,image/png,image/webp"
                     className="hidden"
                     onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setField("image", file);
                        e.target.value = "";
                     }}
                  />

                  {/* Upload area */}
                  <div onClick={() => fileInputRef.current?.click()} className="w-full border border-dashed border-[#B8975A]/30 rounded-xl cursor-pointer hover:border-[#B8975A]/60 hover:bg-[#B8975A]/5 transition-all overflow-hidden">
                     {form.image ? (
                        /* Preview */
                        <div className="relative w-full h-40">
                           <img src={form.image instanceof File ? URL.createObjectURL(form.image) : form.image} alt="preview" className="w-full h-full object-cover" />
                        </div>
                     ) : (
                        /* Placeholder */
                        <div className="w-full h-32 flex flex-col items-center justify-center gap-2">
                           <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                              <path d="M11 14V4M7 8l4-4 4 4" stroke="#B8975A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" stroke="#B8975A" strokeWidth="1.5" strokeLinecap="round" />
                           </svg>
                           <p className="text-[12px] text-[#5E5F60]">
                              <span className="text-[#B8975A] font-medium">Click to upload</span>
                           </p>
                           <p className="text-[11px] text-[#5E5F60]/60">JPG, PNG, WEBP — max 5MB</p>
                        </div>
                     )}
                  </div>

                  {/* Remove button */}
                  {form.image && (
                     <button type="button" onClick={() => setField("image", "")} className="mt-2 text-[11px] text-red-400 hover:text-red-500 transition-colors">
                        Remove image
                     </button>
                  )}

                  {errors.image && <p className="mt-1 text-[11px] text-red-500">{errors.image}</p>}
               </div>

               {/* Parent Category */}
               <div>
                  <Label>Parent Category</Label>
                  <select
                     value={form.parentId ?? ""}
                     onChange={(e) => setField("parentId", e.target.value || null)}
                     className="w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor focus:outline-none focus:border-[#B8975A]/60 transition-colors cursor-pointer"
                  >
                     <option value="">None (Top-level category)</option>
                     {topLevelCats
                        .filter((c) => c._id !== editingId)
                        .map((c) => (
                           <option key={c._id} value={c._id}>
                              {c.name}
                           </option>
                        ))}
                  </select>
               </div>

               {/* Active Toggle */}
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
