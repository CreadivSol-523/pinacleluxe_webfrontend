"use client";

import AdminLayout from "@/layout/AdminLayout";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Monitor, Smartphone, Check } from "lucide-react";
import { useCreateWebSectionHandler } from "@/modals/WebSectionsModal";
import { SaveBar } from "@/ui/UI";
import { StoriesConfig, StoriesData } from "@/Types/WebSection/WebSection";

interface StoryData {
   bannerImageWeb: File | null;
   bannerImageMobile: File | null;
   sectionImageWeb: File | null;
   sectionImageMobile: File | null;
   title: string;
   subtitle: string;
}

interface PreviewURLs {
   bannerImageWeb: string | null;
   bannerImageMobile: string | null;
   sectionImageWeb: string | null;
   sectionImageMobile: string | null;
}

const StoriesPage = ({ handleCreateWebSection, handleUpdateStories, StoriesData }: { handleCreateWebSection: (value: StoriesData) => void; handleUpdateStories: (value: StoriesData) => void; StoriesData: StoriesConfig }) => {
   const [enabled, setEnabled] = useState(true);
   const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
   const [saving, setSaving] = useState(false);
   const [saved, setSaved] = useState(false);
   const [formData, setFormData] = useState<StoryData>({
      bannerImageWeb: null,
      bannerImageMobile: null,
      sectionImageWeb: null,
      sectionImageMobile: null,
      title: (StoriesData as any)?.title ?? "",
      subtitle: (StoriesData as any)?.subtitle ?? "",
   });

   const [previews, setPreviews] = useState<PreviewURLs>({
      bannerImageWeb: (StoriesData as any)?.bannerImageWeb ?? null,
      bannerImageMobile: (StoriesData as any)?.bannerImageMobile ?? null,
      sectionImageWeb: (StoriesData as any)?.sectionImageWeb ?? null,
      sectionImageMobile: (StoriesData as any)?.sectionImageMobile ?? null,
   });

   const handleImageChange = (field: keyof PreviewURLs, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (previews[field]) URL.revokeObjectURL(previews[field] as string);

      setFormData((prev) => ({ ...prev, [field]: file }));
      setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
   };

   const removeImage = (field: keyof PreviewURLs) => {
      if (previews[field]) URL.revokeObjectURL(previews[field] as string);
      setFormData((prev) => ({ ...prev, [field]: null }));
      setPreviews((prev) => ({ ...prev, [field]: null }));
   };

   const handleInputChange = (field: "title" | "subtitle", value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const isStoriesNew = !(StoriesData as unknown as { _id: string })?._id;

   console.log(StoriesData);

   const handleSubmit = async () => {
      setSaving(true);
      setSaved(false);
      try {
         if (isStoriesNew) {
            await handleCreateWebSection({
               enabled: enabled,
               bannerImageWeb: formData.bannerImageWeb || (previews.bannerImageWeb ?? ""),
               bannerImageMobile: formData.bannerImageMobile || (previews.bannerImageMobile ?? ""),
               sectionImageWeb: formData.sectionImageWeb || (previews.sectionImageWeb ?? ""),
               sectionImageMobile: formData.sectionImageMobile || (previews.sectionImageMobile ?? ""),
               title: formData.title,
               subtitle: formData.subtitle,
            });
         } else {
            await handleUpdateStories({
               enabled: enabled,
               bannerImageWeb: formData.bannerImageWeb || (previews.bannerImageWeb ?? ""),
               bannerImageMobile: formData.bannerImageMobile || (previews.bannerImageMobile ?? ""),
               sectionImageWeb: formData.sectionImageWeb || (previews.sectionImageWeb ?? ""),
               sectionImageMobile: formData.sectionImageMobile || (previews.sectionImageMobile ?? ""),
               title: formData.title,
               subtitle: formData.subtitle,
            });
         }
         setSaving(false);
         setSaved(true);
      } catch (error) {
         console.error(error);
         alert("Something went wrong");
      } finally {
         setSaving(false);
         setSaved(true);
      }
   };

   // Desktop box: wide (matches 1920x800). Mobile box: narrow + tall (750x900)
   const ImageUploadBox = ({ field, heightClass, widthClass }: { field: keyof PreviewURLs; heightClass: string; widthClass: string }) => (
      <div className={`relative ${heightClass} ${widthClass} rounded-lg overflow-hidden border border-dashed border-[#C9A659]/40 group bg-white/40`}>
         {previews[field] ? (
            <>
               <Image src={previews[field] as string} alt={field} fill className="object-cover" />
               <button onClick={() => removeImage(field)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors z-10">
                  <X size={14} />
               </button>
            </>
         ) : (
            <label className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#C9A659]/5 transition-colors">
               <Upload size={20} className="text-[#B8975A]" />
               <span className="text-xs text-[#141414]/50">Click to upload</span>
               <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(field, e)} />
            </label>
         )}
      </div>
   );

   useEffect(() => {
      setPreviews({
         bannerImageWeb: (StoriesData as any)?.bannerImageWeb ?? null,
         bannerImageMobile: (StoriesData as any)?.bannerImageMobile ?? null,
         sectionImageWeb: (StoriesData as any)?.sectionImageWeb ?? null,
         sectionImageMobile: (StoriesData as any)?.sectionImageMobile ?? null,
      });
      setFormData({
         bannerImageWeb: null,
         bannerImageMobile: null,
         sectionImageWeb: null,
         sectionImageMobile: null,
         title: (StoriesData as any)?.title ?? "",
         subtitle: (StoriesData as any)?.subtitle ?? "",
      });
      setEnabled((StoriesData as any)?.enabled);
   }, [StoriesData]);

   return (
      <AdminLayout>
         <div className="p-6 space-y-6 bg-staticSecondaryBG min-h-screen">
            <div>
               <h1 className="text-3xl font-semibold text-[#141414]">Our Stories</h1>
               <p className="text-sm text-[#141414]/50">Admin / Content / Our Stories</p>
            </div>

            {/* Banner Section */}
            <div className="bg-white rounded-xl border border-[#C9A659]/20 overflow-hidden">
               <div className="p-6 border-l-2 border-l-[#C9A659]">
                  <h2 className="text-lg font-medium text-[#141414]">Banner Section</h2>
                  <p className="text-sm text-[#141414]/50">Full-width banner image shown at the top of Our Stories page</p>
               </div>

               <div className="mx-6 mb-6 rounded-lg bg-staticSecondaryBG px-6 py-4 flex items-center justify-between">
                  <div>
                     <p className="text-[#141414] font-medium">Enable Banner Section</p>
                     <p className="text-sm text-[#141414]/50">Show or hide the banner image on Our Stories page</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-sm text-[#141414]/60">{enabled ? "Visible" : "Hidden"}</span>
                     <button onClick={() => setEnabled((p) => !p)} className={`w-10 h-5.5 rounded-full relative transition-colors ${enabled ? "bg-[#C9A659]" : "bg-[#141414]/20"}`}>
                        <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${enabled ? "-translate-x-4.5" : "translate-x-0.4.5"}`} />
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-5 px-5 pb-5">
                  <div className="flex-1 min-w-70">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold tracking-wide text-[#141414]/70">DESKTOP IMAGE</span>
                        <span className="text-xs text-[#141414]/40">Recommended: 1920×800px</span>
                     </div>
                     <ImageUploadBox field="bannerImageWeb" heightClass="h-100" widthClass="w-full" />
                  </div>

                  <div className="min-w-55">
                     <div className="flex items-center justify-between mb-2 gap-4">
                        <span className="text-xs font-semibold tracking-wide text-[#141414]/70">MOBILE IMAGE</span>
                        <span className="text-xs text-[#141414]/40">Recommended: 750×900px</span>
                     </div>
                     <ImageUploadBox field="bannerImageMobile" heightClass="h-250" widthClass="w-full" />
                  </div>
               </div>
            </div>

            {/* Story Section */}
            <div className="bg-white rounded-xl border border-[#C9A659]/20 overflow-hidden">
               <div className="p-6 border-l-2 border-l-[#C9A659]">
                  <h2 className="text-lg font-medium text-[#141414]">Story Section</h2>
                  <p className="text-sm text-[#141414]/50">Image with title and subtitle shown below the banner</p>
               </div>

               <div className="grid grid-cols-2 gap-5 px-6 pb-6">
                  <div className="flex-1 min-w-70">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold tracking-wide text-[#141414]/70">DESKTOP IMAGE</span>
                        <span className="text-xs text-[#141414]/40">Recommended: 1600×1000px</span>
                     </div>
                     <ImageUploadBox field="sectionImageWeb" heightClass="h-100" widthClass="w-full" />
                  </div>

                  <div className="min-w-55">
                     <div className="flex items-center justify-between mb-2 gap-4">
                        <span className="text-xs font-semibold tracking-wide text-[#141414]/70">MOBILE IMAGE</span>
                        <span className="text-xs text-[#141414]/40">Recommended: 750×900px</span>
                     </div>
                     <ImageUploadBox field="sectionImageMobile" heightClass="h-250" widthClass="w-full" />
                  </div>
               </div>

               <div className="px-6 pb-6 space-y-4">
                  <div>
                     <label className="text-sm mb-1.5 block text-[#141414]/70">Title</label>
                     <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Enter title"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#C9A659]/30 bg-staticSecondaryBG/50 text-[#141414] focus:outline-none focus:border-[#C9A659] transition-colors"
                     />
                  </div>
                  <div>
                     <label className="text-sm mb-1.5 block text-[#141414]/70">Subtitle</label>
                     <textarea
                        value={formData.subtitle}
                        onChange={(e) => handleInputChange("subtitle", e.target.value)}
                        placeholder="Enter subtitle"
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#C9A659]/30 bg-staticSecondaryBG/50 text-[#141414] focus:outline-none focus:border-[#C9A659] transition-colors resize-none"
                     />
                  </div>
               </div>
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-xl border border-[#C9A659]/20 p-6">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold tracking-widest text-[#B8975A]">LIVE PREVIEW</span>
                  <div className="flex rounded-lg border border-[#C9A659]/30 overflow-hidden">
                     <button onClick={() => setPreviewDevice("desktop")} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${previewDevice === "desktop" ? "bg-[#141414] text-white" : "text-[#141414]/60 hover:bg-staticSecondaryBG"}`}>
                        <Monitor size={14} /> Desktop
                     </button>
                     <button onClick={() => setPreviewDevice("mobile")} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${previewDevice === "mobile" ? "bg-[#141414] text-white" : "text-[#141414]/60 hover:bg-staticSecondaryBG"}`}>
                        <Smartphone size={14} /> Mobile
                     </button>
                  </div>
               </div>

               <div className="rounded-lg overflow-hidden border border-[#C9A659]/20">
                  {/* Fake browser bar */}
                  <div className="bg-[#141414] px-4 py-2.5 flex items-center gap-2">
                     <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                     </div>
                     <div className="flex-1 bg-white/10 rounded px-3 py-1 text-xs text-white/50 max-w-xs">pinacleluxe.com/our-stories</div>
                  </div>

                  <div className={`bg-staticSecondaryBG ${previewDevice === "mobile" ? "max-w-sm mx-auto" : ""}`}>
                     {enabled ? (
                        previews.bannerImageWeb || previews.bannerImageMobile ? (
                           <div className="relative w-full aspect-21/9">
                              <Image src={(previewDevice === "mobile" ? previews.bannerImageMobile : previews.bannerImageWeb) || (previews.bannerImageWeb as string)} alt="Banner preview" fill className="object-cover" />
                           </div>
                        ) : (
                           <div className="w-full aspect-21/9 flex items-center justify-center bg-[#1a1a1a]">
                              <span className="text-white/40 text-sm">No banner image uploaded</span>
                           </div>
                        )
                     ) : (
                        <div className="w-full aspect-21/9 flex items-center justify-center bg-[#1a1a1a]">
                           <span className="text-white/40 text-sm">Banner is disabled</span>
                        </div>
                     )}

                     {(previews.sectionImageWeb || previews.sectionImageMobile || formData.title || formData.subtitle) && (
                        <div className={`p-6 ${previewDevice === "mobile" ? "" : "flex gap-6 items-center"}`}>
                           <div className={`relative ${previewDevice === "mobile" ? "w-full aspect-4/3 mb-4" : "flex-1 aspect-video"}`}>
                              {(previewDevice === "mobile" ? previews.sectionImageMobile : previews.sectionImageWeb) ? (
                                 <Image src={(previewDevice === "mobile" ? previews.sectionImageMobile : previews.sectionImageWeb) as string} alt="Section preview" fill className="object-cover rounded-lg" />
                              ) : (
                                 <div className="w-full h-full rounded-lg bg-[#141414]/10 flex items-center justify-center">
                                    <span className="text-[#141414]/30 text-xs">No image</span>
                                 </div>
                              )}
                           </div>
                           <div className="flex-1">
                              <h3 className="text-xl font-semibold text-[#141414]">{formData.title || "Story title"}</h3>
                              <p className="text-sm text-[#141414]/60 mt-1">{formData.subtitle || "Story subtitle goes here"}</p>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Submit */}

            <SaveBar onSave={handleSubmit} saving={saving} saved={saved} />
         </div>
      </AdminLayout>
   );
};

export default StoriesPage;
