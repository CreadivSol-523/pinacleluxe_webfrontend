// ── Small row helper for drawer ───────────────────────────────────────────────
export function Row({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex items-center justify-between">
         <p className="text-[11px] text-[#5E5F60]">{label}</p>
         <p className="text-[11px] text-headingColor font-medium">{value}</p>
      </div>
   );
}
