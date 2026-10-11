"use client";

import Modal from "@/components/Modal/Modal";

interface DeleteModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: (id?: string) => void;
   loading?: boolean;
   title?: string;
   description?: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, loading = false, title = "Delete Item", description = "Are you sure you want to delete this item? This action cannot be undone." }: DeleteModalProps) {
   return (
      <Modal isOpen={isOpen} onClose={onClose} width="w-full max-w-sm" height="h-auto">
         <div className="px-6 py-5 flex flex-col gap-5">
            {/* Icon */}
            <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
               <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1">
               <h2 className="text-[16px] font-semibold text-headingColor">{title}</h2>
               <p className="text-[13px] text-[#5E5F60] leading-relaxed">{description}</p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-1">
               <button onClick={onClose} disabled={loading} className="px-5 py-2.5 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor transition-colors disabled:opacity-50">
                  Cancel
               </button>
               <button onClick={() => onConfirm()} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-[12px] font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                     <>
                        <svg className="animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none">
                           <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                        </svg>
                        Deleting...
                     </>
                  ) : (
                     <>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                           <path d="M2 3h9M5 3V2h3v1M3.5 3l.5 8h5l.5-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Delete
                     </>
                  )}
               </button>
            </div>
         </div>
      </Modal>
   );
}
