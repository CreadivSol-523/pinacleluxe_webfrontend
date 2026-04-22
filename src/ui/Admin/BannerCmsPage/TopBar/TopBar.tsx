"use client";

import { ColorPicker, Label, SaveBar, SectionCard, Toggle, TopBarConfig, TopBarPreview } from "@/ui/UI";
import { useState } from "react";

// Color presets
const BG_PRESETS = ["#1A1209", "#B8975A", "#2C2C2C", "#0F3D2E", "#1C1C3A", "#7C1D1D"];
const TEXT_PRESETS = ["#FFFFFF", "#F5F0E8", "#B8975A", "#000000", "#FBBF24"];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChangeTopBar() {
   const [topBar, setTopBar] = useState<TopBarConfig>({
      enabled: true,
      message: "Free shipping on orders above Rs 5,000 — Shop Now",
      bgColor: "#1A1209",
      textColor: "#B8975A",
   });
   const [saving, setSaving] = useState(false);
   const [saved, setSaved] = useState(false);

   const updateTopBar = <K extends keyof TopBarConfig>(key: K, value: TopBarConfig[K]) => {
      setTopBar((prev) => ({ ...prev, [key]: value }));
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
      <>
         {/* ── Top Bar Section ── */}
         <SectionCard title="Top Bar" description="Announcement bar shown at the very top of the website">
            <div className="flex flex-col gap-6">
               {/* Enable / Disable */}
               <div className="flex items-center justify-between p-4 bg-[#F5F0E8] rounded-xl border border-[#B8975A]/10">
                  <div>
                     <p className="text-[13px] font-medium text-headingColor">Enable Top Bar</p>
                     <p className="text-[11px] text-[#5E5F60] mt-0.5">Show or hide the announcement bar sitewide</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={`text-[11px] font-medium ${topBar.enabled ? "text-green-500" : "text-[#5E5F60]"}`}>{topBar.enabled ? "Active" : "Hidden"}</span>
                     <Toggle active={topBar.enabled} onChange={() => updateTopBar("enabled", !topBar.enabled)} />
                  </div>
               </div>

               {/* Message */}
               <div>
                  <Label>Message *</Label>
                  <div className="relative">
                     <input
                        type="text"
                        value={topBar.message}
                        onChange={(e) => updateTopBar("message", e.target.value)}
                        placeholder="e.g. Free shipping on orders above Rs 5,000"
                        maxLength={120}
                        className="w-full px-3.5 py-2.5 pr-14 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors"
                     />
                     <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#5E5F60]">{topBar.message.length}/120</span>
                  </div>
               </div>

               {/* Colors */}
               <div className="grid grid-cols-2 gap-5">
                  <ColorPicker label="Background Color" value={topBar.bgColor} onChange={(v) => updateTopBar("bgColor", v)} presets={BG_PRESETS} />
                  <ColorPicker label="Text Color" value={topBar.textColor} onChange={(v) => updateTopBar("textColor", v)} presets={TEXT_PRESETS} />
               </div>

               {/* Live preview */}
               <div>
                  <Label>Live Preview</Label>
                  <TopBarPreview config={topBar} />
               </div>

               <SaveBar onSave={handleSave} saving={saving} saved={saved} />
            </div>
         </SectionCard>
      </>
   );
}
