"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

type ConfirmModalProps = {
   open: boolean;
   title: string;
   description?: ReactNode;
   confirmText?: string;
   cancelText?: string;
   variant?: "danger" | "default";
   loading?: boolean;
   onConfirm: () => void;
   onClose: () => void;
   children?: ReactNode;
};

export default function ConfirmModal({ open, title, description, confirmText = "Confirm", cancelText = "Cancel", variant = "default", loading = false, onConfirm, onClose, children }: ConfirmModalProps) {
   const [visible, setVisible] = useState(false);

   // Enter animation
   useEffect(() => {
      if (!open) {
         setVisible(false);
         return;
      }
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
   }, [open]);

   // Escape key + body scroll lock
   useEffect(() => {
      if (!open) return;

      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape" && !loading) onClose();
      };
      document.addEventListener("keydown", onKey);

      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
         document.removeEventListener("keydown", onKey);
         document.body.style.overflow = prevOverflow;
      };
   }, [open, loading, onClose]);

   if (!open || typeof document === "undefined") return null;

   const isDanger = variant === "danger";

   return createPortal(
      <div className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`} role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
         {/* Backdrop */}
         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !loading && onClose()} />

         {/* Card */}
         <div className={`relative w-full max-w-md bg-staticSecondaryBG border border-[#B8975A]/20 rounded-2xl shadow-2xl p-6 transition-all duration-200 ${visible ? "scale-100 translate-y-0" : "scale-95 translate-y-2"}`}>
            {/* Icon */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDanger ? "bg-red-50 text-red-500" : "bg-[#B8975A]/10 text-[#B8975A]"}`}>
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M10.3 3.9L2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>

            <h2 id="confirm-modal-title" className="font-serif text-[20px]! font-semibold text-headingColor">
               {title}
            </h2>

            {description && <p className="text-[13px]! text-[#5E5F60] mt-2 leading-relaxed">{description}</p>}

            {children && <div className="mt-4">{children}</div>}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6">
               <button onClick={onClose} disabled={loading} className="px-4 py-2.5 text-[12px] font-medium text-headingColor border border-[#B8975A]/30 rounded-lg hover:bg-[#B8975A]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {cancelText}
               </button>
               <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${isDanger ? "bg-red-500 text-white hover:bg-red-600" : "bg-primaryBG text-[#B8975A] hover:bg-headingColor"}`}
               >
                  {loading && (
                     <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                     </svg>
                  )}
                  {loading ? "Please wait..." : confirmText}
               </button>
            </div>
         </div>
      </div>,
      document.body,
   );
}
