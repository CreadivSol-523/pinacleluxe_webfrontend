// components/AlertModal.tsx
import React from "react";

type Variant = "info" | "success" | "warning" | "error";

interface AlertModalProps {
   variant: Variant;
   title: string;
   description: string;
   confirmLabel?: string;
   cancelLabel?: string;
   onConfirm: () => void;
   onCancel: () => void;
}

const modalConfig: Record<Variant, { iconBg: string; iconColor: string; confirmBtn: string }> = {
   info: { iconBg: "bg-blue-50", iconColor: "text-blue-600", confirmBtn: "bg-blue-50  border-blue-200  text-blue-800  hover:bg-blue-100" },
   success: { iconBg: "bg-green-50", iconColor: "text-green-600", confirmBtn: "bg-green-50 border-green-200 text-green-800 hover:bg-green-100" },
   warning: { iconBg: "bg-amber-50", iconColor: "text-amber-600", confirmBtn: "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100" },
   error: { iconBg: "bg-red-50", iconColor: "text-red-600", confirmBtn: "bg-red-50   border-red-200   text-red-800   hover:bg-red-100" },
};

const ModalIcons: Record<Variant, React.ReactNode> = {
   info: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
         <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
         <path d="M10 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
         <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
      </svg>
   ),
   success: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
         <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
         <path d="M6 10l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
   ),
   warning: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
         <path d="M10 2L18 17H2L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
         <path d="M10 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
         <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
      </svg>
   ),
   error: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
         <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
         <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
   ),
};

export const AlertModal = ({ variant, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel }: AlertModalProps) => {
   const c = modalConfig[variant];
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
         <div className="bg-white rounded-2xl border border-gray-100 p-6 w-full max-w-sm mx-4">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${c.iconBg} ${c.iconColor}`}>{ModalIcons[variant]}</div>
            <h2 className="text-base font-medium text-gray-900 mb-2">{title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">{description}</p>
            <div className="flex gap-2 justify-end">
               <button onClick={onCancel} className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                  {cancelLabel}
               </button>
               <button onClick={onConfirm} className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${c.confirmBtn}`}>
                  {confirmLabel}
               </button>
            </div>
         </div>
      </div>
   );
};
