"use client";
import { useCategoryManager } from "@/Validations/CategoryManager/CategoryManager";
import { CategoryModal } from "@/components/Modal/AddCategoryModal";
import AdminLayout from "@/layout/AdminLayout";
import { CategoryTree } from "@/ui/Admin/Category/Tree";

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CategoryPage() {
   const { tree, search, setSearch, expanded, toggleExpand, expandAll, collapseAll, modalOpen, editingId, form, errors, loading, openAdd, openEdit, closeModal, setField, handleNameChange, handleSubmit, toggleActive, deleteCategory, topLevelCats, totalCount, activeCount } = useCategoryManager();

   console.log(form);

   return (
      <AdminLayout>
         <div className="flex flex-col gap-6">
            {/* ── Stat cards ── */}
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
               {[
                  { label: "Total Categories", value: totalCount },
                  { label: "Active", value: activeCount },
                  { label: "Inactive", value: totalCount - activeCount },
               ].map((s) => (
                  <div key={s.label} className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                     <p className="text-[10px] tracking-[0.14em] uppercase text-[#5E5F60] mb-2">{s.label}</p>
                     <p className="font-serif text-[28px] font-semibold text-headingColor leading-none">{s.value}</p>
                  </div>
               ))}
            </div>

            {/* ── Toolbar ── */}
            <div className="flex items-center gap-3 flex-wrap">
               {/* Search */}
               <div className="relative flex-1 min-w-50">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E5F60]" width="15" height="15" viewBox="0 0 16 16" fill="none">
                     <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                     <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <input
                     type="text"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder="Search categories..."
                     className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60] focus:outline-none focus:border-[#B8975A]/50 transition-colors"
                  />
               </div>

               {/* Expand / Collapse */}
               <button onClick={expandAll} className="px-3 py-2.5 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 bg-staticSecondaryBG rounded-lg hover:text-headingColor transition-colors">
                  Expand All
               </button>
               <button onClick={collapseAll} className="px-3 py-2.5 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 bg-staticSecondaryBG rounded-lg hover:text-headingColor transition-colors">
                  Collapse All
               </button>

               {/* Add category */}
               <button onClick={() => openAdd(null)} className="flex items-center gap-2 px-4 py-2.5 bg-primaryBG text-[#B8975A] text-[13px] font-medium tracking-[0.04em] rounded-lg hover:bg-headingColor transition-colors whitespace-nowrap">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Add Category
               </button>
            </div>

            {/* ── Tree table ── */}
            <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl overflow-hidden">
               {/* Table head */}
               <div className="flex items-center gap-3 px-4 py-3 border-b border-[#B8975A]/15 bg-[#F5F0E8]/60">
                  <div className="w-5 shrink-0 max-sm:hidden" />
                  <div className="w-9 shrink-0 max-sm:hidden" />
                  <p className="flex-1 text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] font-medium">Category</p>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] font-medium hidden sm:block w-10">Sub</p>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] font-medium ">Active</p>
                  <div className="w-24 shrink-0 max-sm:hidden" />
               </div>

               {tree.length > 0 ? (
                  <CategoryTree nodes={tree} expanded={expanded} onToggleExpand={toggleExpand} onEdit={openEdit} onDelete={deleteCategory} onToggleActive={toggleActive} onAddSub={(parentId) => openAdd(parentId)} />
               ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                     <svg className="text-[#B8975A]/30 mb-3" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 14h16M12 20h10M12 26h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                     <p className="text-[13px] font-medium text-headingColor">No categories found</p>
                     <p className="text-[12px] text-[#5E5F60] mt-1">Add your first category to get started</p>
                  </div>
               )}
            </div>

            {/* ── Modal ── */}
            <CategoryModal isOpen={modalOpen} onClose={closeModal} editingId={editingId} form={form} errors={errors} loading={loading} setField={setField} handleNameChange={handleNameChange} handleSubmit={handleSubmit} topLevelCats={topLevelCats} />
         </div>
      </AdminLayout>
   );
}
