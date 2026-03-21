export function InfoRow({ icon, value }: { icon: React.ReactNode; value: string }) {
   return (
      <div className="flex items-center gap-2.5">
         <span className="text-[#5E5F60] shrink-0">{icon}</span>
         <p className="text-[12px] text-headingColor">{value}</p>
      </div>
   );
}
