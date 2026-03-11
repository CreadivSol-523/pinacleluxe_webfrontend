"use client";

import { Dialog } from "@headlessui/react";
import { ReactNode } from "react";

type ModalProps = {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
   width?: string;
   height?: string;
};

export default function Modal({ isOpen, onClose, children, width = "w-[90vw]", height = "h-[70vh]" }: ModalProps) {
   return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-100">
         {/* Overlay */}
         <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" aria-hidden="true" />

         {/* Modal container */}
         <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className={`bg-white rounded-lg shadow-xl overflow-hidden ${width} ${height}`}>{children}</Dialog.Panel>
         </div>
      </Dialog>
   );
}
