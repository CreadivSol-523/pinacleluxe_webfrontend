import { OrderStatus } from "@/Types/Order/OrderType";

export const Label = ({ children }: { children: React.ReactNode }) => <p className="text-[11px] tracking-[0.08em] uppercase text-[#5E5F60] mb-1.5">{children}</p>;

export function ColorPicker({ label, value, onChange, presets }: { label: string; value: string; onChange: (v: string) => void; presets: string[] }) {
   return (
      <div>
         <Label>{label}</Label>
         <div className="flex items-center gap-3">
            {/* Custom picker */}
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#B8975A]/20 shrink-0">
               <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-[200%] h-[200%] -top-2 -left-2 cursor-pointer opacity-0" />
               <div className="w-full h-full rounded-lg" style={{ backgroundColor: value }} />
            </div>
            <p className="text-[12px] font-mono text-[#5E5F60] w-20">{value}</p>
            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
               {presets.map((c) => (
                  <button key={c} onClick={() => onChange(c)} title={c} className={`w-7 h-7 rounded-md border-2 transition-all ${value === c ? "border-[#B8975A] scale-110" : "border-transparent hover:border-[#B8975A]/40"}`} style={{ backgroundColor: c }} />
               ))}
            </div>
         </div>
      </div>
   );
}

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

export function SaveBar({ onSave, saving, saved }: { onSave: () => void; saving: boolean; saved: boolean }) {
   return (
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#B8975A]/10 mt-2">
         {saved && (
            <span className="flex items-center gap-1.5 text-[12px] text-green-500">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
               Saved
            </span>
         )}
         <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] font-medium tracking-[0.04em] rounded-lg hover:bg-headingColor transition-colors disabled:opacity-60">
            {saving ? (
               <>
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 14 14" fill="none">
                     <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                  </svg>
                  Saving...
               </>
            ) : (
               <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M2 7l3.5 3.5L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Save Changes
               </>
            )}
         </button>
      </div>
   );
}

// ── Top Bar Preview ───────────────────────────────────────────────────────────

export interface TopBarConfig {
   enabled: boolean;
   message: string;
   bgColor: string;
   textColor: string;
}
export function TopBarPreview({ config }: { config: TopBarConfig }) {
   return (
      <div className="rounded-xl overflow-hidden border border-[#B8975A]/10">
         {/* Browser chrome mockup */}
         <div className="bg-[#2A2A2A] px-3 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 mx-2 bg-[#3A3A3A] rounded px-3 py-1 text-[10px] text-[#888]">pinacleluxe.com</div>
         </div>
         {/* Top bar */}
         <div
            className="py-2.5 px-4 text-center text-[12px] font-medium tracking-[0.05em] transition-all duration-300"
            style={{
               backgroundColor: config.enabled ? config.bgColor : "#2C2C2C",
               color: config.enabled ? config.textColor : "#666",
               opacity: config.enabled ? 1 : 0.5,
            }}
         >
            {config.enabled ? config.message || "Your announcement text will appear here..." : "Top bar is disabled"}
         </div>
         {/* Fake nav */}
         <div className="bg-[#F5F0E8] px-4 py-3 flex items-center justify-between">
            <div className="w-20 h-3 bg-[#B8975A]/30 rounded" />
            <div className="flex gap-4">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-2 bg-[#5E5F60]/20 rounded" />
               ))}
            </div>
            <div className="w-16 h-3 bg-[#B8975A]/20 rounded" />
         </div>
      </div>
   );
}

export const SectionCard = ({ children, title, description }: { children: React.ReactNode; title: string; description: string }) => (
   <div className="bg-staticSecondaryBG rounded-2xl border border-[#B8975A]/15 overflow-hidden">
      <div className="px-6 py-5 border-b border-[#B8975A]/10 flex items-center gap-3">
         <div className="w-1 h-8 rounded-full bg-[#B8975A]/60" />
         <div>
            <h3 className="text-[14px] font-semibold text-headingColor tracking-[0.02em]">{title}</h3>
            <p className="text-[11px] text-[#5E5F60] mt-0.5">{description}</p>
         </div>
      </div>
      <div className="px-6 py-5">{children}</div>
   </div>
);

// ── Info row ──────────────────────────────────────────────────────────────────
export function InfoRow({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex items-center justify-between py-2.5 border-b border-[#B8975A]/8 last:border-0">
         <p className="text-[11px] text-[#5E5F60]">{label}</p>
         <p className="text-[12px] font-medium text-headingColor">{value}</p>
      </div>
   );
}

export function InfoIconRow({ icon, value }: { icon: React.ReactNode; value: string }) {
   return (
      <div className="flex items-center gap-2.5">
         <span className="text-[#5E5F60] shrink-0">{icon}</span>
         <p className="text-[12px] text-headingColor">{value}</p>
      </div>
   );
}

const STATUS_STYLE: Record<OrderStatus, string> = {
   Pending: "bg-amber-50 text-amber-700",
   Processing: "bg-blue-50 text-blue-700",
   Shipped: "bg-purple-50 text-purple-700",
   Delivered: "bg-green-50 text-green-700",
   Cancelled: "bg-red-50 text-red-600",
};
export function StatusBadge({ status }: { status: OrderStatus }) {
   return <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full w-fit ${STATUS_STYLE[status]}`}>{status}</span>;
}
