"use client";

import { Label, SaveBar, SectionCard, Toggle } from "@/ui/UI";
import { useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface HeroConfig {
   enabled: boolean;
   desktopImage: string; // base64 or ""
   mobileImage: string; // base64 or ""
}

// ── Image Upload Box ──────────────────────────────────────────────────────────
function ImageUploadBox({ label, hint, value, onChange, aspectClass }: { label: string; hint: string; value: string; onChange: (base64: string) => void; aspectClass: string }) {
   const fileRef = useRef<HTMLInputElement>(null);
   const [dragging, setDragging] = useState(false);

   const handleFile = (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
   };

   return (
      <div className="flex flex-col gap-2">
         <div className="flex items-center justify-between">
            <Label>{label}</Label>
            <p className="text-[10px] text-[#5E5F60]/70 mb-1.5">{hint}</p>
         </div>

         <div
            className={`relative ${aspectClass} rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer
               ${dragging ? "border-[#B8975A] bg-[#B8975A]/5" : "border-dashed border-[#B8975A]/30 hover:border-[#B8975A]/60 bg-[#F5F0E8]"}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
               e.preventDefault();
               setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
         >
            {value ? (
               <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value} alt="" className="w-full h-full object-cover" />
                  {/* Replace overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                     <div className="flex flex-col items-center gap-1.5">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                           <path d="M10 13V4M6 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                           <path d="M3 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <p className="text-[11px] text-white font-medium">Replace Image</p>
                     </div>
                  </div>
                  {/* Remove button */}
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        onChange("");
                     }}
                     className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                  >
                     <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                     </svg>
                  </button>
               </>
            ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                  <div className="w-10 h-10 rounded-full bg-[#B8975A]/10 flex items-center justify-center">
                     <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-[#B8975A]">
                        <path d="M9 12V4M5 8l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 15h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                     </svg>
                  </div>
                  <p className="text-[12px] font-medium text-headingColor text-center">Click or drag to upload</p>
                  <p className="text-[10px] text-[#5E5F60] text-center">PNG, JPG, WEBP supported</p>
               </div>
            )}
         </div>

         <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
               const f = e.target.files?.[0];
               if (f) handleFile(f);
               e.target.value = "";
            }}
         />
      </div>
   );
}

// ── Hero Preview ──────────────────────────────────────────────────────────────
function HeroPreview({ config }: { config: HeroConfig }) {
   const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
   const img = previewMode === "desktop" ? config.desktopImage : config.mobileImage;

   return (
      <div className="flex flex-col gap-2">
         {/* Mode toggle */}
         <div className="flex items-center justify-between">
            <Label>Live Preview</Label>
            <div className="flex items-center bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg overflow-hidden">
               {(["desktop", "mobile"] as const).map((mode) => (
                  <button
                     key={mode}
                     onClick={() => setPreviewMode(mode)}
                     className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] transition-colors
                        ${previewMode === mode ? "bg-primaryBG text-[#B8975A]" : "text-[#5E5F60] hover:text-headingColor"}`}
                  >
                     {mode === "desktop" ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                           <rect x="1" y="1.5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                           <path d="M4 10.5h4M6 8.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                     ) : (
                        <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                           <rect x="1" y="0.5" width="8" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                           <path d="M4 9.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                     )}
                     {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
               ))}
            </div>
         </div>

         {/* Browser mockup */}
         <div className={`rounded-xl overflow-hidden border border-[#B8975A]/10 transition-all duration-300 ${previewMode === "mobile" ? "max-w-[220px] mx-auto" : "w-full"}`}>
            {/* Chrome bar */}
            <div className="bg-[#2A2A2A] px-3 py-2 flex items-center gap-2">
               <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
               </div>
               <div className="flex-1 mx-2 bg-[#3A3A3A] rounded px-3 py-1 text-[10px] text-[#888]">pinacleluxe.com</div>
            </div>

            {/* Fake top bar */}
            <div className="py-1.5 text-center text-[9px] bg-[#1A1209] text-[#B8975A]">Free shipping on orders above Rs 5,000</div>

            {/* Fake nav — hide on mobile */}
            {previewMode === "desktop" && (
               <div className="bg-[#F5F0E8] px-4 py-2 flex items-center justify-between border-b border-[#B8975A]/10">
                  <div className="w-14 h-2 bg-[#B8975A]/30 rounded" />
                  <div className="flex gap-3">
                     {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-10 h-1.5 bg-[#5E5F60]/20 rounded" />
                     ))}
                  </div>
                  <div className="w-10 h-2 bg-[#B8975A]/20 rounded" />
               </div>
            )}

            {/* Hero image area */}
            <div className={`w-full bg-[#2C2C2C] flex items-center justify-center transition-all duration-300 ${previewMode === "desktop" ? "h-[200px]" : "h-[280px]"}`}>
               {!config.enabled ? (
                  <p className="text-[11px] text-[#666]">Hero is disabled</p>
               ) : img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="Hero preview" className="w-full h-full object-cover" />
               ) : (
                  <div className="flex flex-col items-center gap-2 opacity-30">
                     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-white">
                        <rect x="3" y="3" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.4" />
                        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M3 19l6-5 4 4 3-3 9 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                     <p className="text-[10px] text-white">No image uploaded</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ChangeHeroSection() {
   const [hero, setHero] = useState<HeroConfig>({
      enabled: true,
      desktopImage: "",
      mobileImage: "",
   });
   const [saving, setSaving] = useState(false);
   const [saved, setSaved] = useState(false);

   const update = <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => {
      setHero((prev) => ({ ...prev, [key]: value }));
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
      <SectionCard title="Hero Section" description="Full-width hero image shown at the top of the homepage">
         <div className="flex flex-col gap-6">
            {/* Enable / Disable */}
            <div className="flex items-center justify-between p-4 bg-[#F5F0E8] rounded-xl border border-[#B8975A]/10">
               <div>
                  <p className="text-[13px] font-medium text-headingColor">Enable Hero Section</p>
                  <p className="text-[11px] text-[#5E5F60] mt-0.5">Show or hide the hero image on homepage</p>
               </div>
               <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-medium ${hero.enabled ? "text-green-500" : "text-[#5E5F60]"}`}>{hero.enabled ? "Active" : "Hidden"}</span>
                  <Toggle active={hero.enabled} onChange={() => update("enabled", !hero.enabled)} />
               </div>
            </div>

            {/* Image uploads */}
            <div className="grid grid-cols-2 gap-5">
               <ImageUploadBox label="Desktop Image" hint="Recommended: 1920×800px" value={hero.desktopImage} onChange={(v) => update("desktopImage", v)} aspectClass="aspect-[16/7]" />
               <ImageUploadBox label="Mobile Image" hint="Recommended: 750×900px" value={hero.mobileImage} onChange={(v) => update("mobileImage", v)} aspectClass="aspect-[3/4]" />
            </div>

            {/* Live Preview */}
            <HeroPreview config={hero} />

            <SaveBar onSave={handleSave} saving={saving} saved={saved} />
         </div>
      </SectionCard>
   );
}
