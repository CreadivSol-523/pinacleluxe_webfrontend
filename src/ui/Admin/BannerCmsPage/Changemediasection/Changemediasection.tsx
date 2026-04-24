"use client";

import { Label, SaveBar, SectionCard, Toggle } from "@/ui/UI";
import { useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type MediaMode = "image" | "video";

export interface MediaSectionConfig {
   enabled: boolean;
   mode: MediaMode;
   // image mode
   desktopImage: string;
   mobileImage: string;
   // video mode
   video: string;
}

// ── Upload Box (Image) ────────────────────────────────────────────────────────
function ImageUploadBox({ label, hint, value, onChange, aspectClass }: { label: string; hint: string; value: string; onChange: (base64: string) => void; aspectClass: string }) {
   const fileRef = useRef<HTMLInputElement>(null);
   const [dragging, setDragging] = useState(false);

   const handleFile = (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
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
            onDrop={(e) => {
               e.preventDefault();
               setDragging(false);
               const f = e.dataTransfer.files?.[0];
               if (f) handleFile(f);
            }}
         >
            {value ? (
               <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                     <p className="text-[11px] text-white font-medium">Replace Image</p>
                  </div>
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
                  <p className="text-[10px] text-[#5E5F60] text-center">PNG, JPG, WEBP</p>
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

// ── Upload Box (Video) ────────────────────────────────────────────────────────
function VideoUploadBox({ value, onChange }: { value: string; onChange: (base64: string) => void }) {
   const fileRef = useRef<HTMLInputElement>(null);
   const [dragging, setDragging] = useState(false);

   const handleFile = (file: File) => {
      if (!file.type.startsWith("video/")) return;
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
   };

   return (
      <div className="flex flex-col gap-2">
         <Label>Video File</Label>
         <p className="text-[10px] text-[#5E5F60]/70 -mt-1 mb-1">MP4, WEBM — same video used for desktop & mobile</p>

         <div
            className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer
               ${dragging ? "border-[#B8975A] bg-[#B8975A]/5" : "border-dashed border-[#B8975A]/30 hover:border-[#B8975A]/60 bg-[#F5F0E8]"}`}
            onClick={() => !value && fileRef.current?.click()}
            onDragOver={(e) => {
               e.preventDefault();
               setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
               e.preventDefault();
               setDragging(false);
               const f = e.dataTransfer.files?.[0];
               if (f) handleFile(f);
            }}
         >
            {value ? (
               <>
                  <video src={value} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                  {/* Replace + Remove */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 hover:opacity-100">
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           fileRef.current?.click();
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/20 backdrop-blur-sm text-white text-[11px] rounded-lg hover:bg-white/30 transition-colors"
                     >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                           <path d="M6.5 9V2M3.5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                           <path d="M1.5 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        Replace
                     </button>
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           onChange("");
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-500/80 backdrop-blur-sm text-white text-[11px] rounded-lg hover:bg-red-500 transition-colors"
                     >
                        <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                           <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        Remove
                     </button>
                  </div>
                  {/* Playing badge */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md">
                     <div className="flex gap-0.5 items-end h-3">
                        {[1, 2, 3].map((i) => (
                           <div key={i} className="w-1 bg-[#B8975A] rounded-sm animate-pulse" style={{ height: `${[8, 12, 6][i - 1]}px`, animationDelay: `${i * 0.15}s` }} />
                        ))}
                     </div>
                     <p className="text-[9px] text-white">Playing</p>
                  </div>
               </>
            ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#B8975A]/10 flex items-center justify-center">
                     <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-[#B8975A]">
                        <path d="M8 5l10 6-10 6V5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                        <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.2" />
                     </svg>
                  </div>
                  <p className="text-[12px] font-medium text-headingColor">Click or drag to upload video</p>
                  <p className="text-[10px] text-[#5E5F60]">MP4, WEBM supported</p>
               </div>
            )}
         </div>
         <input
            ref={fileRef}
            type="file"
            accept="video/*"
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

// ── Preview ───────────────────────────────────────────────────────────────────
function MediaPreview({ config }: { config: MediaSectionConfig }) {
   const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
   const showMobileToggle = config.mode === "image";
   const imgSrc = viewMode === "desktop" ? config.desktopImage : config.mobileImage;

   return (
      <div className="flex flex-col gap-2">
         <div className="flex items-center justify-between">
            <Label>Live Preview</Label>
            {showMobileToggle && (
               <div className="flex items-center bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg overflow-hidden">
                  {(["desktop", "mobile"] as const).map((mode) => (
                     <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] transition-colors
                           ${viewMode === mode ? "bg-primaryBG text-[#B8975A]" : "text-[#5E5F60] hover:text-headingColor"}`}
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
            )}
            {config.mode === "video" && <span className="text-[10px] text-[#5E5F60] bg-[#F5F0E8] border border-[#B8975A]/20 px-2.5 py-1 rounded-lg">Same video — desktop & mobile</span>}
         </div>

         <div className={`rounded-xl overflow-hidden border border-[#B8975A]/10 transition-all duration-300 ${config.mode === "image" && viewMode === "mobile" ? "max-w-[220px] mx-auto" : "w-full"}`}>
            {/* Chrome */}
            <div className="bg-[#2A2A2A] px-3 py-2 flex items-center gap-2">
               <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
               </div>
               <div className="flex-1 mx-2 bg-[#3A3A3A] rounded px-3 py-1 text-[10px] text-[#888]">pinacleluxe.com</div>
            </div>

            {/* Media area */}
            <div
               className={`w-full bg-[#1A1A1A] flex items-center justify-center transition-all
               ${config.mode === "image" && viewMode === "mobile" ? "aspect-[3/4]" : "aspect-video"}`}
            >
               {!config.enabled ? (
                  <p className="text-[11px] text-[#666]">Section is disabled</p>
               ) : config.mode === "image" ? (
                  imgSrc ? (
                     <img src={imgSrc} alt="" className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                  ) : (
                     <div className="flex flex-col items-center gap-2 opacity-30">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-white">
                           <rect x="3" y="3" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.4" />
                           <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                           <path d="M3 19l6-5 4 4 3-3 9 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-[10px] text-white">No image uploaded</p>
                     </div>
                  )
               ) : config.video ? (
                  <video src={config.video} className="w-full h-full object-cover" muted autoPlay loop playsInline />
               ) : (
                  <div className="flex flex-col items-center gap-2 opacity-30">
                     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-white">
                        <path d="M8 6l14 8-14 8V6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                     </svg>
                     <p className="text-[10px] text-white">No video uploaded</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ChangeMediaSection() {
   const [media, setMedia] = useState<MediaSectionConfig>({
      enabled: true,
      mode: "image",
      desktopImage: "",
      mobileImage: "",
      video: "",
   });
   const [saving, setSaving] = useState(false);
   const [saved, setSaved] = useState(false);

   const update = <K extends keyof MediaSectionConfig>(key: K, value: MediaSectionConfig[K]) => {
      setMedia((prev) => ({ ...prev, [key]: value }));
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
      <SectionCard title="Image / Video Section" description="Full-width media section — switch between image or video mode">
         <div className="flex flex-col gap-6">
            {/* Enable / Disable */}
            <div className="flex items-center justify-between p-4 bg-[#F5F0E8] rounded-xl border border-[#B8975A]/10">
               <div>
                  <p className="text-[13px] font-medium text-headingColor">Enable Media Section</p>
                  <p className="text-[11px] text-[#5E5F60] mt-0.5">Show or hide this section on homepage</p>
               </div>
               <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-medium ${media.enabled ? "text-green-500" : "text-[#5E5F60]"}`}>{media.enabled ? "Active" : "Hidden"}</span>
                  <Toggle active={media.enabled} onChange={() => update("enabled", !media.enabled)} />
               </div>
            </div>

            {/* Mode switcher */}
            <div>
               <Label>Media Type</Label>
               <div className="grid grid-cols-2 gap-3">
                  {(["image", "video"] as MediaMode[]).map((mode) => (
                     <button
                        key={mode}
                        onClick={() => update("mode", mode)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-left
                           ${media.mode === mode ? "border-[#B8975A] bg-primaryBG" : "border-[#B8975A]/15 bg-[#F5F0E8] hover:border-[#B8975A]/40"}`}
                     >
                        <div
                           className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                           ${media.mode === mode ? "bg-[#B8975A]/20" : "bg-staticSecondaryBG"}`}
                        >
                           {mode === "image" ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={media.mode === mode ? "text-[#B8975A]" : "text-[#5E5F60]"}>
                                 <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
                                 <circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
                                 <path d="M1 11l4-3 3 3 2.5-2 4.5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           ) : (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={media.mode === mode ? "text-[#B8975A]" : "text-[#5E5F60]"}>
                                 <path d="M5 3.5l8 4.5-8 4.5V3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                 <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.1" />
                              </svg>
                           )}
                        </div>
                        <div>
                           <p className={`text-[13px] font-medium ${media.mode === mode ? "text-[#B8975A]" : "text-headingColor"}`}>{mode === "image" ? "Image" : "Video"}</p>
                           <p className="text-[10px] text-[#5E5F60] mt-0.5">{mode === "image" ? "Desktop + Mobile images" : "One video for all devices"}</p>
                        </div>
                        {media.mode === mode && (
                           <div className="ml-auto w-4 h-4 rounded-full bg-[#B8975A] flex items-center justify-center shrink-0">
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                 <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </div>
                        )}
                     </button>
                  ))}
               </div>
            </div>

            {/* Image mode */}
            {media.mode === "image" && (
               <div className="grid grid-cols-2 gap-5">
                  <ImageUploadBox label="Desktop Image" hint="Recommended: 1920×800px" value={media.desktopImage} onChange={(v) => update("desktopImage", v)} aspectClass="aspect-[16/7]" />
                  <ImageUploadBox label="Mobile Image" hint="Recommended: 750×900px" value={media.mobileImage} onChange={(v) => update("mobileImage", v)} aspectClass="aspect-[3/4]" />
               </div>
            )}

            {/* Video mode */}
            {media.mode === "video" && <VideoUploadBox value={media.video} onChange={(v) => update("video", v)} />}

            {/* Preview */}
            <MediaPreview config={media} />

            <SaveBar onSave={handleSave} saving={saving} saved={saved} />
         </div>
      </SectionCard>
   );
}
