"use client";

import { CarouselConfig } from "@/Types/WebSection/WebSection";
import { Label, SaveBar, SectionCard, Toggle } from "@/ui/UI";
import { useEffect, useState } from "react";
import { useRef } from "react";

// ── Image Upload Box (same pattern as Hero/Media) ─────────────────────────────
function ImageUploadBox({ label, hint, previewUrl, onChange, aspectClass }: { label: string; hint: string; previewUrl: string; onChange: (file: File | null, previewUrl: string) => void; aspectClass: string }) {
   const fileRef = useRef<HTMLInputElement>(null);
   const [dragging, setDragging] = useState(false);

   const handleFile = (file: File) => {
      if (!file.type.startsWith("image/")) return;

      // agar purana blob url tha to usay revoke kr do (memory leak avoid krne k liye)
      if (previewUrl && previewUrl.startsWith("blob:")) {
         URL.revokeObjectURL(previewUrl);
      }

      const url = URL.createObjectURL(file);
      onChange(file, url);
   };

   const handleRemove = () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
         URL.revokeObjectURL(previewUrl);
      }
      onChange(null, "");
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
            {previewUrl ? (
               <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                     <div className="flex flex-col items-center gap-1.5">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                           <path d="M10 13V4M6 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                           <path d="M3 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <p className="text-[11px] text-white font-medium">Replace Image</p>
                     </div>
                  </div>
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
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

// ── Slide local state (File-per-slide + preview + text) ───────────────────────
type SlideState = {
   id: string; // sirf list render/reorder ke liye stable local key, backend ko nahi jaata
   image: File | null;
   imagePreview: string;
   text: string;
};

const makeId = () => Math.random().toString(36).slice(2, 9);

// ── Main Component ────────────────────────────────────────────────────────────
export default function ChangeCarouselSection({ initialCarousel, handleSaveCarousel, handleUpdateCarousel }: { initialCarousel?: CarouselConfig; handleSaveCarousel: (formData: CarouselConfig) => void; handleUpdateCarousel: (formData: CarouselConfig) => void }) {
   const [enabled, setEnabled] = useState(initialCarousel?.enabled ?? true);
   const [slides, setSlides] = useState<SlideState[]>(() =>
      (initialCarousel?.slides ?? []).map((s) => ({
         id: makeId(),
         image: null,
         imagePreview: (s.image as any) ?? "",
         text: s.text ?? "",
      })),
   );
   const [saving, setSaving] = useState(false);
   const [saved, setSaved] = useState(false);

   // Unmount pe sab blob urls revoke kr do
   useEffect(() => {
      return () => {
         slides.forEach((s) => {
            if (s.imagePreview.startsWith("blob:")) URL.revokeObjectURL(s.imagePreview);
         });
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const updateSlide = (id: string, patch: Partial<SlideState>) => {
      setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
      setSaved(false);
   };

   const addSlide = () => {
      setSlides((prev) => [...prev, { id: makeId(), image: null, imagePreview: "", text: "" }]);
      setSaved(false);
   };

   const removeSlide = (id: string) => {
      setSlides((prev) => {
         const target = prev.find((s) => s.id === id);
         if (target?.imagePreview.startsWith("blob:")) URL.revokeObjectURL(target.imagePreview);
         return prev.filter((s) => s.id !== id);
      });
      setSaved(false);
   };

   const moveSlide = (index: number, direction: "up" | "down") => {
      setSlides((prev) => {
         const newIndex = direction === "up" ? index - 1 : index + 1;
         if (newIndex < 0 || newIndex >= prev.length) return prev;
         const updated = [...prev];
         [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
         return updated;
      });
      setSaved(false);
   };

   const isCarouselNew = !(initialCarousel as unknown as { _id: string })?._id;

   const handleSave = async () => {
      setSaving(true);
      setSaved(false);
      try {
         const payload: CarouselConfig = {
            enabled,
            slides: slides?.map((s) => ({
               image: s.image ?? s.imagePreview, // naya File hy to wo bhejo, warna purana url as-is
               text: s.text,
            })),
         };
         if (isCarouselNew) {
            await handleSaveCarousel(payload);
         } else {
            await handleUpdateCarousel(payload);
         }
         setSaved(true);
         setTimeout(() => setSaved(false), 3000);
      } finally {
         setSaving(false);
      }
   };

   return (
      <SectionCard title="Inspiration Carousel" description="Manage the 'World of Inspiration' slider shown on the homepage">
         <div className="flex flex-col gap-6">
            {/* Enable / Disable */}
            <div className="flex items-center justify-between p-4 bg-[#F5F0E8] rounded-xl border border-[#B8975A]/10">
               <div>
                  <p className="text-[13px] font-medium text-headingColor">Enable Carousel</p>
                  <p className="text-[11px] text-[#5E5F60] mt-0.5">Show or hide this section on homepage</p>
               </div>
               <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-medium ${enabled ? "text-green-500" : "text-[#5E5F60]"}`}>{enabled ? "Active" : "Hidden"}</span>
                  <Toggle
                     active={enabled}
                     onChange={() => {
                        setEnabled((prev) => !prev);
                        setSaved(false);
                     }}
                  />
               </div>
            </div>

            {/* Slides list */}
            <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between">
                  <Label>Slides ({slides.length})</Label>
                  <button onClick={addSlide} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-full bg-primaryBG text-[#B8975A] border border-[#B8975A]/20 hover:border-[#B8975A]/40 transition-colors">
                     + Add Slide
                  </button>
               </div>

               {slides.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed border-[#B8975A]/20 rounded-xl bg-[#F5F0E8]">
                     <p className="text-[12px] text-[#5E5F60]">
                        No slide available <strong> + Add Slide. </strong>
                     </p>
                  </div>
               )}

               <div className="grid grid-cols-3 gap-5">
                  {slides.map((slide, index) => (
                     <div key={slide.id} className="flex flex-col gap-3 p-4 rounded-xl border border-[#B8975A]/10 bg-white">
                        <div className="flex items-center justify-between">
                           <span className="text-[11px] font-medium text-[#5E5F60]">Slide {index + 1}</span>
                           <div className="flex items-center gap-1">
                              <button onClick={() => moveSlide(index, "up")} disabled={index === 0} className="w-6 h-6 flex items-center justify-center rounded-md border border-[#B8975A]/20 text-[#5E5F60] disabled:opacity-30 hover:border-[#B8975A]/40">
                                 ↑
                              </button>
                              <button onClick={() => moveSlide(index, "down")} disabled={index === slides.length - 1} className="w-6 h-6 flex items-center justify-center rounded-md border border-[#B8975A]/20 text-[#5E5F60] disabled:opacity-30 hover:border-[#B8975A]/40">
                                 ↓
                              </button>
                              <button onClick={() => removeSlide(slide.id)} className="w-6 h-6 flex items-center justify-center rounded-md bg-red-500 text-white hover:bg-red-600 ml-1">
                                 <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                    <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                                 </svg>
                              </button>
                           </div>
                        </div>

                        <ImageUploadBox label="Image" hint="Recommended: 600×840px" previewUrl={slide.imagePreview} onChange={(file, previewUrl) => updateSlide(slide.id, { image: file, imagePreview: previewUrl })} aspectClass="aspect-[3/4]" />

                        <div className="flex flex-col gap-1.5">
                           <Label>Username / Caption</Label>
                           <input
                              type="text"
                              value={slide.text}
                              onChange={(e) => updateSlide(slide.id, { text: e.target.value })}
                              placeholder="@username"
                              className="w-full px-3 py-2 text-[12px] rounded-lg border border-[#B8975A]/20 bg-[#F5F0E8] text-headingColor placeholder:text-[#5E5F60]/50 focus:outline-none focus:border-[#B8975A]/50"
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <SaveBar onSave={handleSave} saving={saving} saved={saved} />
         </div>
      </SectionCard>
   );
}
