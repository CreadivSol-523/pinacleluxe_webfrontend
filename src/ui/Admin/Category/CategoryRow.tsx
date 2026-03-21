"use client";

import { Toggle } from "@/components/Modal/AddCategoryModal";
import { Category } from "@/Types/Category/Category";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

// ── Three dot dropdown (mobile only) ─────────────────────────────────────────
function ActionsDropdown({ depth, onAddSub, onEdit, onDelete }: { depth: number; onAddSub: () => void; onEdit: () => void; onDelete: () => void }) {
   const [open, setOpen] = useState(false);
   const ref = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handler = (e: MouseEvent) => {
         if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
   }, []);

   return (
      <div ref={ref} className="relative">
         <button onClick={() => setOpen((p) => !p)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5E5F60] hover:bg-[#B8975A]/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
               <circle cx="8" cy="3" r="1.2" fill="currentColor" />
               <circle cx="8" cy="8" r="1.2" fill="currentColor" />
               <circle cx="8" cy="13" r="1.2" fill="currentColor" />
            </svg>
         </button>

         {open && (
            <div className="absolute right-0 top-8 z-30 w-44 bg-staticSecondaryBG border border-[#B8975A]/20 rounded-xl shadow-lg overflow-hidden">
               {depth === 0 && (
                  <button
                     onClick={() => {
                        onAddSub();
                        setOpen(false);
                     }}
                     className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-[#B8975A] hover:bg-[#B8975A]/8 transition-colors"
                  >
                     <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                     Add Subcategory
                  </button>
               )}
               <button
                  onClick={() => {
                     onEdit();
                     setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-headingColor hover:bg-[#B8975A]/8 transition-colors"
               >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M9 2l2 2-7 7H2v-2L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                  Edit
               </button>
               <button
                  onClick={() => {
                     onDelete();
                     setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors border-t border-[#B8975A]/10"
               >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M2 4h9M5 4V2.5h3V4M4 4l.5 6.5h4L9 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Delete
               </button>
            </div>
         )}
      </div>
   );
}

// ── Single category row ───────────────────────────────────────────────────────
export function CategoryRow({
   cat,
   depth,
   isExpanded,
   hasChildren,
   onToggleExpand,
   onEdit,
   onDelete,
   onToggleActive,
   onAddSub,
}: {
   cat: Category;
   depth: number;
   isExpanded: boolean;
   hasChildren: boolean;
   onToggleExpand: () => void;
   onEdit: () => void;
   onDelete: () => void;
   onToggleActive: () => void;
   onAddSub: () => void;
}) {
   return (
      <div
         className={`flex items-center gap-3 px-4 justify-between py-3 border-b border-[#B8975A]/8 bg-[#B8975A]/3 transition-colors group
            ${depth > 0 ? "bg-[#F5F0E8]/40" : ""} max-sm:pl-0!`}
         style={{ paddingLeft: `${16 + depth * 28}px` }}
      >
         <div className="flex items-center gap-2">
            {/* Expand toggle */}
            <button
               onClick={onToggleExpand}
               className={`w-5 h-5 flex items-center justify-center text-[#5E5F60] transition-all shrink-0
                  ${hasChildren ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
                  <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </button>

            {/* Thumbnail */}
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-staticSecondaryBG border border-[#B8975A]/15 shrink-0">
               {cat.image ? (
                  <Image src={cat.image} alt={cat.name} width={36} height={36} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center">
                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="1" width="12" height="12" rx="2" stroke="#B8975A" strokeWidth="1.2" strokeOpacity="0.4" />
                        <path d="M1 9l3-3 3 3 2-2 4 4" stroke="#B8975A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
                     </svg>
                  </div>
               )}
            </div>

            {/* Name + slug */}
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                  <p className={`text-[13px] font-medium text-headingColor truncate ${depth > 0 ? "text-[12px]" : ""}`}>{cat.name}</p>
                  {depth === 0 && <span className="text-[9px] tracking-widest uppercase text-[#B8975A] bg-[#B8975A]/10 px-2 py-0.5 rounded-full shrink-0">Parent</span>}
               </div>
               <p className="text-[11px] text-[#5E5F60] font-mono truncate">/{cat.slug}</p>
            </div>
         </div>

         <div className="flex items-center gap-2">
            {/* Children count */}
            {hasChildren && <span className="text-[11px] text-[#5E5F60] shrink-0 hidden sm:block">{cat.children?.length ?? 0} sub</span>}

            {/* Active toggle */}
            <Toggle active={cat.isActive} onChange={onToggleActive} />

            {/* Desktop: inline buttons */}
            <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               {depth === 0 && (
                  <button onClick={onAddSub} title="Add subcategory" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#B8975A] bg-[#B8975A]/10 transition-colors">
                     <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                  </button>
               )}
               <button onClick={onEdit} title="Edit" className="w-7 h-7 flex items-center justify-center rounded-lg text-headingColor bg-[#B8975A] transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M9 2l2 2-7 7H2v-2L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
               </button>
               <button onClick={onDelete} title="Delete" className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 bg-red-50 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M2 4h9M5 4V2.5h3V4M4 4l.5 6.5h4L9 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
            </div>

            {/* Mobile: 3-dot dropdown */}
            <div className="sm:hidden">
               <ActionsDropdown depth={depth} onAddSub={onAddSub} onEdit={onEdit} onDelete={onDelete} />
            </div>
         </div>
      </div>
   );
}
