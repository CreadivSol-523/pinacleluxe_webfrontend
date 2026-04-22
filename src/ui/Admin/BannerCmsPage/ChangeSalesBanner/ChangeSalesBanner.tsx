"use client";

import { ColorPicker, Label, SaveBar, SectionCard, Toggle } from "@/ui/UI";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SalesBannerConfig {
   enabled: boolean;
   title: string;
   subtitle: string;
   bgColor: string;
   textColor: string;
   btnLabel: string;
   btnUrl: string;
   btnBgColor: string;
   btnTextColor: string;
}

// ── Presets ───────────────────────────────────────────────────────────────────
const BG_PRESETS = ["#1A1209", "#B8975A", "#2C2C2C", "#0F3D2E", "#1C1C3A", "#7C1D1D"];
const TEXT_PRESETS = ["#FFFFFF", "#F5F0E8", "#B8975A", "#000000", "#FBBF24"];

// ── Sales Banner Preview ──────────────────────────────────────────────────────
function SalesBannerPreview({ config }: { config: SalesBannerConfig }) {
   return (
      <div className="rounded-xl overflow-hidden border border-[#B8975A]/10">
         {/* Browser chrome */}
         <div className="bg-[#2A2A2A] px-3 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 mx-2 bg-[#3A3A3A] rounded px-3 py-1 text-[10px] text-[#888]">pinacleluxe.com</div>
         </div>

         {/* Fake top bar */}
         <div className="py-1.5 px-4 text-center text-[10px] bg-[#1A1209] text-[#B8975A]">Free shipping on orders above Rs 5,000</div>

         {/* Fake nav */}
         <div className="bg-[#F5F0E8] px-4 py-2.5 flex items-center justify-between border-b border-[#B8975A]/10">
            <div className="w-16 h-2.5 bg-[#B8975A]/30 rounded" />
            <div className="flex gap-3">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-1.5 bg-[#5E5F60]/20 rounded" />
               ))}
            </div>
            <div className="w-12 h-2.5 bg-[#B8975A]/20 rounded" />
         </div>

         {/* Sales banner */}
         <div
            className="px-8 py-10 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 min-h-[120px]"
            style={{
               backgroundColor: config.enabled ? config.bgColor : "#2C2C2C",
               opacity: config.enabled ? 1 : 0.4,
            }}
         >
            {config.enabled ? (
               <>
                  <p className="text-[18px] font-serif font-semibold tracking-[0.03em] leading-tight" style={{ color: config.textColor }}>
                     {config.title || "Your Sale Title Here"}
                  </p>
                  {config.subtitle && (
                     <p className="text-[12px] tracking-wide" style={{ color: config.textColor, opacity: 0.8 }}>
                        {config.subtitle}
                     </p>
                  )}
                  {config.btnLabel && (
                     <div className="mt-1 px-5 py-2 text-[11px] font-medium rounded-lg tracking-[0.04em]" style={{ backgroundColor: config.btnBgColor, color: config.btnTextColor }}>
                        {config.btnLabel}
                     </div>
                  )}
               </>
            ) : (
               <p className="text-[12px] text-[#666]">Sales banner is disabled</p>
            )}
         </div>
      </div>
   );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ChangeSalesBanner() {
   const [banner, setBanner] = useState<SalesBannerConfig>({
      enabled: true,
      title: "End of Season Sale — Up to 40% Off",
      subtitle: "Limited time offer on selected luxury bags",
      bgColor: "#1A1209",
      textColor: "#F5F0E8",
      btnLabel: "Shop the Sale",
      btnUrl: "/sale",
      btnBgColor: "#B8975A",
      btnTextColor: "#1A1209",
   });
   const [saving, setSaving] = useState(false);
   const [saved, setSaved] = useState(false);

   const update = <K extends keyof SalesBannerConfig>(key: K, value: SalesBannerConfig[K]) => {
      setBanner((prev) => ({ ...prev, [key]: value }));
      setSaved(false);
   };

   const handleSave = async () => {
      setSaving(true);
      setSaved(false);
      await new Promise((r) => setTimeout(r, 700));
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
   };

   return (
      <SectionCard title="Sales Banner" description="Full-width promotional banner shown below the navigation">
         <div className="flex flex-col gap-6">
            {/* Enable / Disable */}
            <div className="flex items-center justify-between p-4 bg-[#F5F0E8] rounded-xl border border-[#B8975A]/10">
               <div>
                  <p className="text-[13px] font-medium text-headingColor">Enable Sales Banner</p>
                  <p className="text-[11px] text-[#5E5F60] mt-0.5">Show or hide the promotional banner sitewide</p>
               </div>
               <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-medium ${banner.enabled ? "text-green-500" : "text-[#5E5F60]"}`}>{banner.enabled ? "Active" : "Hidden"}</span>
                  <Toggle active={banner.enabled} onChange={() => update("enabled", !banner.enabled)} />
               </div>
            </div>

            {/* Title */}
            <div>
               <Label>Title *</Label>
               <div className="relative">
                  <input
                     type="text"
                     value={banner.title}
                     onChange={(e) => update("title", e.target.value)}
                     placeholder="e.g. End of Season Sale — Up to 40% Off"
                     maxLength={80}
                     className="w-full px-3.5 py-2.5 pr-14 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#5E5F60]">{banner.title.length}/80</span>
               </div>
            </div>

            {/* Subtitle */}
            <div>
               <Label>Subtitle</Label>
               <div className="relative">
                  <input
                     type="text"
                     value={banner.subtitle}
                     onChange={(e) => update("subtitle", e.target.value)}
                     placeholder="e.g. Limited time offer on selected luxury bags"
                     maxLength={120}
                     className="w-full px-3.5 py-2.5 pr-14 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#5E5F60]">{banner.subtitle.length}/120</span>
               </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-5">
               <ColorPicker label="Background Color" value={banner.bgColor} onChange={(v) => update("bgColor", v)} presets={BG_PRESETS} />
               <ColorPicker label="Text Color" value={banner.textColor} onChange={(v) => update("textColor", v)} presets={TEXT_PRESETS} />
            </div>

            {/* CTA Button */}
            <div className="bg-[#F5F0E8] rounded-xl p-4 flex flex-col gap-4 border border-[#B8975A]/10">
               <p className="text-[11px] tracking-[0.08em] uppercase text-[#5E5F60]">CTA Button</p>

               <div className="grid grid-cols-2 gap-4">
                  {/* Button label */}
                  <div>
                     <Label>Button Label</Label>
                     <input
                        type="text"
                        value={banner.btnLabel}
                        onChange={(e) => update("btnLabel", e.target.value)}
                        placeholder="e.g. Shop the Sale"
                        maxLength={30}
                        className="w-full px-3.5 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors"
                     />
                  </div>
                  {/* Button URL */}
                  <div>
                     <Label>Button URL</Label>
                     <input
                        type="text"
                        value={banner.btnUrl}
                        onChange={(e) => update("btnUrl", e.target.value)}
                        placeholder="e.g. /sale or https://..."
                        className="w-full px-3.5 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-5">
                  <ColorPicker label="Button Background" value={banner.btnBgColor} onChange={(v) => update("btnBgColor", v)} presets={[...BG_PRESETS, "#B8975A"]} />
                  <ColorPicker label="Button Text Color" value={banner.btnTextColor} onChange={(v) => update("btnTextColor", v)} presets={TEXT_PRESETS} />
               </div>
            </div>

            {/* Live Preview */}
            <div>
               <Label>Live Preview</Label>
               <SalesBannerPreview config={banner} />
            </div>

            <SaveBar onSave={handleSave} saving={saving} saved={saved} />
         </div>
      </SectionCard>
   );
}
