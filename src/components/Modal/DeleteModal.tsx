"use client";

import { useEffect, useId, useRef, useState } from "react";
import Modal from "@/components/Modal/Modal";

interface DeleteModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: (id?: string) => void;
   loading?: boolean;
   title?: string;
   description?: string;
   confirmLabel?: string;
   cancelLabel?: string;
   loadingLabel?: string;
}

// Total length of the "product drops into bin" animation
const ANIMATION_MS = 1200;

type Phase = "idle" | "playing" | "done";

export default function DeleteModal({ isOpen, onClose, onConfirm, loading = false, title = "Delete Item", description = "Are you sure you want to delete this item? This action cannot be undone.", confirmLabel = "Delete", cancelLabel = "Cancel", loadingLabel = "Deleting..." }: DeleteModalProps) {
   const titleId = useId();
   const descId = useId();
   const [phase, setPhase] = useState<Phase>("idle");
   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

   // Animation khatam ho gayi aur request bhi complete -> reset (failure case me modal wapas usable)
   useEffect(() => {
      if (phase === "done" && !loading) setPhase("idle");
   }, [phase, loading]);

   useEffect(() => {
      return () => {
         if (timer.current) clearTimeout(timer.current);
      };
   }, []);

   const handleConfirm = () => {
      if (phase !== "idle" || loading) return;

      const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      setPhase("playing");
      onConfirm(); // request animation ke saath parallel chalti hai
      timer.current = setTimeout(() => setPhase("done"), reduceMotion ? 250 : ANIMATION_MS);
   };

   const busy = loading || phase !== "idle";
   const playing = phase === "playing";

   return (
      // Parent agar jaldi close kar de, tab bhi animation poori hone tak modal open rehta hai
      <Modal isOpen={isOpen || playing} onClose={busy ? () => {} : onClose} width="w-full max-w-[400px]" height="h-auto">
         <style>{`
            .dm-lid, .dm-item, .dm-bin { transform-box: fill-box; }
            .dm-lid { transform-origin: 0% 100%; }
            .dm-item { transform-origin: 50% 50%; opacity: 0; }
            .dm-bin { transform-origin: 50% 100%; }

            .dm-playing .dm-lid  { animation: dm-lid ${ANIMATION_MS}ms cubic-bezier(.4,0,.2,1) forwards; }
            .dm-playing .dm-item { animation: dm-item ${ANIMATION_MS}ms cubic-bezier(.5,0,.75,.4) forwards; }
            .dm-playing .dm-bin  { animation: dm-bin ${ANIMATION_MS}ms ease-out forwards; }
            .dm-playing .dm-halo { animation: dm-halo ${ANIMATION_MS}ms ease-out forwards; }

            /* Lid khulta hai -> product girta hai -> lid band */
            @keyframes dm-lid {
               0%   { transform: rotate(0deg); }
               14%  { transform: rotate(-32deg); }
               62%  { transform: rotate(-32deg); }
               80%  { transform: rotate(0deg); }
               100% { transform: rotate(0deg); }
            }
            @keyframes dm-item {
               0%   { opacity: 0; transform: translateY(-4px) scale(1) rotate(0deg); }
               10%  { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
               50%  { opacity: 1; transform: translateY(20px) scale(.7) rotate(14deg); }
               62%  { opacity: 0; transform: translateY(28px) scale(.4) rotate(20deg); }
               100% { opacity: 0; transform: translateY(28px) scale(.4) rotate(20deg); }
            }
            @keyframes dm-bin {
               0%, 76% { transform: scale(1, 1); }
               86%     { transform: scale(1.07, .93); }
               94%     { transform: scale(.98, 1.03); }
               100%    { transform: scale(1, 1); }
            }
            @keyframes dm-halo {
               0%, 70% { box-shadow: 0 0 0 0 rgba(220,38,38,.25); }
               100%    { box-shadow: 0 0 0 18px rgba(220,38,38,0); }
            }
            @media (prefers-reduced-motion: reduce) {
               .dm-playing .dm-lid, .dm-playing .dm-item, .dm-playing .dm-bin, .dm-playing .dm-halo { animation: none; }
            }
         `}</style>

         <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId} aria-busy={busy} className={`flex flex-col ${playing ? "dm-playing" : ""}`}>
            {/* Body */}
            <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-6 text-center sm:items-start sm:text-left">
               {/* Animated bin */}
               <div className="dm-halo flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60" aria-hidden="true">
                  <svg width="44" height="44" viewBox="0 0 64 64" fill="none" overflow="visible">
                     {/* Product jo bin me jata hai */}
                     <g className="dm-item">
                        <rect x="25" y="4" width="14" height="14" rx="3" fill="#FCA5A5" stroke="#DC2626" strokeWidth="2" />
                        <path d="M25 9.5h14" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                     </g>

                     {/* Bin body */}
                     <g className="dm-bin">
                        <path d="M17 26l2.5 26a4 4 0 0 0 4 3.6h17a4 4 0 0 0 4-3.6L47 26" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M27 33v15M37 33v15" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                     </g>

                     {/* Lid (left hinge se khulta hai) */}
                     <g className="dm-lid">
                        <path d="M13 24h38" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M26 24v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                     </g>
                  </svg>
               </div>

               {/* Text */}
               <div className="flex flex-col gap-1.5">
                  <h2 id={titleId} className="text-[17px] font-semibold leading-snug tracking-tight text-headingColor">
                     {title}
                  </h2>
                  <p id={descId} className="text-[13px] leading-relaxed text-[#5E5F60]">
                     {description}
                  </p>
               </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-2.5 border-t border-[#B8975A]/15 bg-gray-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
               <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  autoFocus
                  className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg border border-[#B8975A]/30 bg-white px-5 text-[13px] font-medium text-[#5E5F60] transition-colors duration-200 hover:border-[#B8975A]/60 hover:text-headingColor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8975A]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[40px]"
               >
                  {cancelLabel}
               </button>

               <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={busy}
                  className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-[13px] font-semibold text-white shadow-sm shadow-red-600/20 transition-all duration-200 hover:bg-red-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none motion-reduce:active:scale-100 sm:min-h-[40px]"
               >
                  {busy ? (
                     <>
                        <svg className="animate-spin motion-reduce:animate-none" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                           <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                           <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <span role="status">{loadingLabel}</span>
                     </>
                  ) : (
                     <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                           <path d="M3 6h18" />
                           <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                           <path d="M19 6l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                        {confirmLabel}
                     </>
                  )}
               </button>
            </div>
         </div>
      </Modal>
   );
}
