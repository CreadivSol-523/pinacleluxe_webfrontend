"use client";
import Button from "@/components/Button/Button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { products } from "../../../../DummyData/Products.json";
import React, { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useCartStore } from "@/Storage/UseCartStore";
import { Product, VariantSchema } from "@/Types/Collection/CollectionTypes";
import AccessoriesCard from "@/components/Cards/AccessoriesCard/AccessoriesCard";
import { useGetSingleProductHandler } from "@/modals/ProductModal";
import { ParamValue } from "next/dist/server/request/params";

const SingleProductSection = ({ data, id }: { data?: Product; id?: ParamValue }) => {
   const [selectedColor, setSelectedColor] = useState<{ hex: { code: string; colorName: string }; images: (string | File)[] }>({ hex: { code: "", colorName: "" }, images: [] });
   const [selectedMaterials, setSelectedMaterials] = useState<VariantSchema>({
      material: "",
      price: [{ price: 0, region: "", discountValue: 0, discountMode: "" }],
      stock: 0,
      colors: [{ hex: { code: "", colorName: "" }, images: [] }],
   });
   const [showAccessories, setShowAccessories] = useState<boolean>(false);
   const [quantity, setQuantity] = useState(1);
   const [accordion, setAccordion] = useState<number | null>();
   const [current, setCurrent] = useState(0);
   const [activeIndex, setActiveIndex] = useState(0);
   const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
   const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});
   const [images, setImages] = useState<string[]>([]);

   const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
   const startX = useRef(0);

   const contactFAQs = [
      {
         question: "How can I contact CreadivSol?",
         answer: "We strive to respond to all inquiries promptly, but response times may vary depending on the volume of messages we receive.",
      },
      {
         question: "Do you work with international clients?",
         answer: "Yes, we work with clients from different countries around the world. We handle communication online and deliver projects smoothly, no matter where you are located.",
      },
      {
         question: "What services does CreadivSol offer?",
         answer:
            "CreadivSol offers embroidery digitizing and vector art, custom patches, custom merchandise, web design and development, web applications, mobile app development, SEO and social media marketing, digital marketing and e commerce solutions, SaaS platforms, POS systems, video editing and animation, BPO services, and professional graphic design solutions.",
      },
      {
         question: "How many revisions do you offer?",
         answer: "We offer multiple revisions to ensure complete client satisfaction. Revisions are provided according to the project scope and requirements discussed before starting the project.",
      },
   ];

   const { addToCart, updateQuantity, setCartOpen } = useCartStore();

   const findProduct = data;

   const originalPrice = selectedMaterials?.material != "" ? selectedMaterials?.price?.[0]?.price : findProduct?.isVariable ? findProduct?.variants?.[0]?.price?.[0]?.price : (findProduct as any)?.pricing?.[0]?.price;

   const discountValue = selectedMaterials?.material != "" ? selectedMaterials?.price?.[0]?.discountValue : findProduct?.isVariable ? findProduct?.variants[0]?.price?.[0]?.discountValue : (findProduct as any)?.pricing?.[0]?.discountValue;

   const discountPercentage = originalPrice > 0 ? Math.round((discountValue / originalPrice) * 100) : 0;

   // const GetCartSingleItem = useCartStore((state) => state.items.find((item) => item.id === findProduct?._id && item.colorVariants === selectedColor.hex?.code && item.material === selectedMaterials.material));
   const GetCartSingleItem = useCartStore((state) =>
      state.items.find((item) => {
         if (findProduct?.isVariable) {
            return item.id === findProduct._id && item.colorVariants === selectedColor.hex?.code && item.material === selectedMaterials.material;
         }

         return item.id === findProduct?._id;
      }),
   );

   const GetQuantitySelected = useEffectEvent(() => {
      setQuantity(GetCartSingleItem?.quantity || 1);
   });

   useEffect(() => {
      setImages([...((findProduct as any)?.thumbnail ? (findProduct as any).thumbnail : []), ...(findProduct?.images ?? [])]);
   }, [findProduct]);

   console.log(images);
   useEffect(() => {
      if (images.length === 0) return;

      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               const index = imageRefs.current.findIndex((ref) => ref === entry.target);
               if (index === -1) return;

               if (entry.isIntersecting) {
                  // animation trigger — ek dafa true hone ke baad hamesha true rahega
                  setVisibleImages((prev) => {
                     if (prev.has(index)) return prev;
                     const next = new Set(prev);
                     next.add(index);
                     return next;
                  });
               }
            });

            // active index (border wala) ka logic alag rakho, most-visible wala
            const visibleEntries = entries.filter((e) => e.isIntersecting);
            if (visibleEntries.length > 0) {
               const mostVisible = visibleEntries.reduce((prev, curr) => (curr.intersectionRatio > prev.intersectionRatio ? curr : prev));
               const activeIdx = imageRefs.current.findIndex((ref) => ref === mostVisible.target);
               if (activeIdx !== -1) setActiveIndex(activeIdx);
            }
         },
         { threshold: 0.15 }, // 15% visible hote hi trigger, low rakho taake early fire ho
      );

      imageRefs.current.forEach((ref) => ref && observer.observe(ref));
      return () => observer.disconnect();
   }, [images.length]);

   useEffect(() => {
      GetQuantitySelected();
   }, [GetCartSingleItem]);

   useEffect(() => {
      if (findProduct?.isVariable) {
         setSelectedColor({ hex: { code: "", colorName: "" }, images: findProduct?.variants?.[0]?.colors?.[0].images || [] });
      }
      setSelectedMaterials({
         material: findProduct?.isVariable ? findProduct?.variants?.[0]?.material : "",
         price: [
            {
               price: originalPrice,
               region: findProduct?.isVariable ? findProduct?.variants?.[0]?.price?.[0]?.region : ((findProduct as any)?.pricing?.[0]?.region ?? 0),
               discountValue: discountValue,
               discountMode: findProduct?.isVariable ? findProduct?.variants?.[0]?.price?.[0]?.discountMode : ((findProduct as any)?.pricing?.[0]?.discountMode ?? 0),
            },
         ],
         colors: findProduct?.isVariable ? findProduct?.variants?.[0]?.colors : [],
         stock: findProduct?.stock,
      });
   }, [findProduct]);

   // Update Quantity
   const handleIncreaseQuantity = () => {
      const updateProductQuantity = quantity < (selectedMaterials?.stock ?? 0) ? quantity + 1 : quantity;
      setQuantity(updateProductQuantity);
      updateQuantity(findProduct?._id || "", updateProductQuantity, selectedColor.hex?.code, selectedMaterials.material);
   };

   const handleDecreaseQuantity = () => {
      const updateProductQuantity = quantity <= 1 ? 1 : quantity - 1;
      setQuantity(updateProductQuantity);

      updateQuantity(findProduct?._id || "", updateProductQuantity, selectedColor.hex?.code, selectedMaterials.material);
   };

   const goTo = (idx: number) => {
      setCurrent(Math.max(0, Math.min(images.length - 1, idx)));
   };

   const handleTouchStart = (e: React.TouchEvent) => {
      startX.current = e.touches[0].clientX;
   };

   const handleTouchEnd = (e: React.TouchEvent) => {
      const diff = startX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
   };

   // Scroll function add karo
   const scrollToImage = (index: number) => {
      imageRefs.current[index]?.scrollIntoView({
         behavior: "smooth",
         block: "center",
      });
   };

   return (
      <section className="  flex relative items-start xl:gap-12 gap-5 max-md:flex-col bg-white!">
         <div className="lg:pl-5 pl-0 flex flex-col xl:w-auto w-15 gap-2 max-xl:items-center max-xl:justify-center sticky top-30 max-xl:h-[calc(100vh-150px)] overflow-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[950px]:hidden">
            {images.map((src, i) => (
               <div key={i} onClick={() => scrollToImage(i)} className="cursor-pointer">
                  <Image src={src as string} width={100} height={120} alt="Product side image" className={`xl:flex hidden border transition-all duration-300 ${activeIndex === i ? "border-textBlack" : "border-transparent"}`} />
                  <div className={`w-4 h-4 bg-transparent border border-textBlack rounded-full xl:hidden flex justify-center items-center `}>
                     <div className={`rounded-full transition-all duration-300 ${activeIndex === i ? "bg-textBlack  w-full h-full" : "bg-transparent  w-0 h-0"}`} />
                  </div>
               </div>
            ))}
         </div>
         <div className="flex-col gap-5 md:flex hidden">
            {images.map((src, i) => (
               <div
                  key={i}
                  ref={(el) => {
                     imageRefs.current[i] = el;
                  }}
                  className={`transition-all duration-700 ease-out ${visibleImages.has(i) ? "opacity-100 translate-y-0" : "opacity-10 translate-y-8"}`}
               >
                  <Image src={src as string} width={800} height={1000} alt="Product side image" onLoad={() => setLoadedImages((prev) => ({ ...prev, [i]: true }))} className="object-contain" />
               </div>
            ))}
         </div>
         <div className="md:hidden w-full">
            {/* Scroller */}
            <div className="overflow-hidden " onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
               <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                  {images.map((src, i) => (
                     <div key={i} className="min-w-full">
                        <Image src={src as string} width={800} height={1000} alt={`Product image ${i + 1}`} className="w-full object-cover" />
                     </div>
                  ))}
               </div>
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-3">
               {images.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-black" : "w-2 bg-gray-300"}`} />
               ))}
            </div>
         </div>
         <div className="lg:pr-10 pr-5 max-md:px-5 flex flex-col gap-10 md:w-200 sticky top-10 md:max-h-[calc(100vh-50px)] pb-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <p className="text-[#5E5F60]! lg:flex hidden">Cart / Shipping / {id}</p>
            <div className="flex flex-col gap-2.5">
               <h2 className="text-headingColor">{findProduct?.name}</h2>
               <div className="flex gap-5">
                  <h3 className={`text-[20px]! text-headingColor ${discountValue ? "line-through" : ""} `}>Rs {selectedMaterials?.price?.[0]?.price}</h3>
                  {discountValue > 0 && (
                     <span className="bg-BtnBlack px-2 py-0.5">
                        <p className="text-white">
                           -{discountPercentage}% Rs {discountValue}
                        </p>
                     </span>
                  )}
               </div>
            </div>
            <p className="text-textBlack">{findProduct?.description}</p>
            {findProduct?.isVariable && (
               <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                     <p className="text-headingColor">Color - Green</p>
                     <div className="flex items-center flex-wrap gap-2">
                        {selectedMaterials?.colors?.map((item, i) =>
                           selectedColor.hex?.code === item.hex?.code ? (
                              <div className="w-6 h-6 border-2 border-gray-500 cursor-pointer  rounded-full flex items-center justify-center" key={item.hex?.code}>
                                 <div className={`w-4 h-4 rounded-full ${item.hex?.code}`} style={{ background: item.hex?.code }} />
                              </div>
                           ) : (
                              <div
                                 onClick={() => {
                                    setSelectedColor({ hex: item.hex, images: item.images });
                                    setImages([...((item.images as any) ?? [])]);
                                 }}
                                 className={`w-6 h-6 cursor-pointer rounded-full ${item.hex?.code}`}
                                 style={{ background: item.hex?.code }}
                                 key={i}
                              />
                           ),
                        )}
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <p className="text-headingColor">Material:</p>
                     <div className="flex items-center flex-wrap  gap-3.5">
                        {findProduct?.isVariable &&
                           findProduct?.variants.map((materials, i) => (
                              <div
                                 key={i}
                                 className={`cursor-pointer active:scale-99 py-2 px-6 rounded-full border-2 ${selectedMaterials.material === materials.material ? "border-BtnBlack bg-BtnBlack" : "border-gray-400 bg-white"} `}
                                 onClick={() => {
                                    setSelectedMaterials(materials);
                                 }}
                              >
                                 <p className={`${selectedMaterials.material === materials.material ? "text-white" : "text-textBlack"}  tracking-wide`}>{materials.material}</p>
                              </div>
                           ))}
                     </div>
                  </div>
               </div>
            )}
            <div className="flex gap-5 2xl:w-150 max-md:flex-col">
               <div className="flex items-center gap-3 px-6 py-2 border-2 border-gray-400 rounded-full w-fit">
                  <Minus
                     className="w-4 h-4 cursor-pointer"
                     onClick={() => {
                        if (GetCartSingleItem) {
                           handleDecreaseQuantity();
                           console.log("run");
                        } else {
                           setQuantity((prev) => Math.max(1, prev - 1));
                           console.log("run2");
                        }
                     }}
                  />
                  {/* <p className="flex-nowrap">{GetCartSingleItem != undefined ? GetCartSingleItem?.quantity : quantity}</p> */}
                  <p className="min-w-6 text-center whitespace-nowrap">{GetCartSingleItem?.quantity ?? quantity}</p>
                  <Plus
                     onClick={() => {
                        if (GetCartSingleItem) {
                           handleIncreaseQuantity();
                        } else {
                           setQuantity((prev) => (prev < (selectedMaterials?.stock ?? 0) ? prev + 1 : prev));
                        }
                     }}
                     className="w-4 h-4 cursor-pointer"
                  />
               </div>
               <Button
                  // name={GetCartSingleItem ? "Already In Bag" : "Add To Bag"}
                  name={GetCartSingleItem ? "Add more" : "Add To Bag"}
                  className="w-full"
                  // disabled={!!GetCartSingleItem}
                  onClick={() => {
                     if (GetCartSingleItem) {
                        handleIncreaseQuantity();
                        setCartOpen(true);
                     } else {
                        setCartOpen(true);
                        addToCart(
                           {
                              id: findProduct?._id || "",
                              name: findProduct?.name || "",
                              images: (findProduct as any)?.images?.[0] || "",
                              colorVariants: findProduct?.isVariable ? (findProduct?.variants[0]?.colors?.[0]?.hex.code as string) : "",
                              material: findProduct?.isVariable ? selectedMaterials.material : "",
                              price: selectedMaterials.price?.[0]?.price ?? 0,
                              stock: selectedMaterials?.stock || 0,
                           },
                           quantity,
                        );
                     }
                  }}
               />
            </div>
            <div>
               <div className=" text-white">
                  <div className="flex items-center gap-2 pl-6 border-b border-gray-400 pb-4 cursor-pointer">
                     <Image src={"/Icons/SendIcon.svg"} width={20} height={20} alt="Send icon svg" />
                     <p className="text-textBlack font-semibold!">Share on Whatsapp</p>
                  </div>
                  <div className="flex flex-col ">
                     <div className={`${showAccessories ? "mb-2" : "pb-0"} transition-all duration-500    rounded-xl`}>
                        <span className={`${showAccessories && "text-headingColor"} transition-all duration-700  flex items-center justify-between  py-4 px-6 cursor-pointer`} onClick={() => setShowAccessories(!showAccessories)}>
                           <p className=" text-headingColor font-semibold!">Add Accessories</p>
                           <ChevronDown className={showAccessories ? "transition-transform duration-300 rotate-0 text-headingColor" : " transition-transform duration-300 rotate-180 text-headingColor"} />
                        </span>
                        <div className={`${showAccessories ? "max-h-50 opacity-100  pb-4" : "max-h-0 opacity-0"} px-6  overflow-y-auto overflow-x-hidden flex flex-col gap-3 text-headingColor relative transition-normal duration-700 `}>
                           {/* {products.map((item) => (
                              <AccessoriesCard selectedColor={selectedColor} selectedMaterials={selectedMaterials} product={item} isButton key={item?.id + item.badge} />
                           ))} */}
                        </div>
                        <Separator className="bg-gray-400" />
                     </div>
                     {contactFAQs.map((item, index) => (
                        <div key={index} className={`${accordion == index + 1 ? "mb-2" : "pb-0"} transition-all duration-500    rounded-xl`}>
                           <span className={`${accordion == index + 1 && "text-headingColor"} transition-all duration-700  flex items-center justify-between  py-4 px-6 cursor-pointer`} onClick={() => setAccordion((prev) => (prev === index + 1 ? null : index + 1))}>
                              <p className=" text-headingColor font-semibold!">{item?.question}</p>
                              <ChevronDown className={accordion == index + 1 ? "transition-transform duration-300 rotate-0 text-headingColor" : " transition-transform duration-300 rotate-180 text-headingColor"} />
                           </span>
                           <p className={`${accordion === index + 1 ? "max-h-100 opacity-100  pb-4" : "max-h-0 opacity-0"} px-6  overflow-hidden text-headingColor relative transition-normal duration-700 `}>{item?.answer}</p>
                           <Separator className="bg-gray-400" />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default SingleProductSection;
