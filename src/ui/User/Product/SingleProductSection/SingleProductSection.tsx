"use client";
import Button from "@/components/Button/Button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { products } from "../../../../DummyData/Products.json";
import React, { useEffect, useEffectEvent, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useCartStore } from "@/Storage/UseCartStore";
import AccessoriesCard from "@/components/Cards/AccessoriesCard/AccessoriesCard";

const SingleProductSection = () => {
   const [selectedColor, setSelectedColor] = useState<{ hex: string; images: string[] }>({ hex: "", images: [] });
   const [selectedMaterials, setSelectedMaterials] = useState<string>("");
   const [showAccessories, setShowAccessories] = useState<boolean>(false);
   const [quantity, setQuantity] = useState(1);
   const [accordion, setAccordion] = useState<number | null>();
   const [current, setCurrent] = useState(0);
   const [activeIndex, setActiveIndex] = useState(0);

   const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
   const startX = useRef(0);

   const { id } = useParams();

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

   const { addToCart, updateQuantity } = useCartStore();

   const findProduct = products.find((item) => item.slug === id);

   const GetCartSingleItem = useCartStore((state) => state.items.find((item) => item.id === findProduct?.id && item.colorVariants === selectedColor.hex && item.material === selectedMaterials));

   const GetQuantitySelected = useEffectEvent(() => {
      setQuantity(GetCartSingleItem?.quantity || 1);
   });

   useEffect(() => {
      const observers: IntersectionObserver[] = [];

      imageRefs.current.forEach((ref, i) => {
         if (!ref) return;

         const observer = new IntersectionObserver(
            (entries) => {
               entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                     setActiveIndex(i);
                  }
               });
            },
            {
               threshold: 0.5, // 50% image visible ho to active ho
            },
         );

         observer.observe(ref);
         observers.push(observer);
      });

      return () => observers.forEach((obs) => obs.disconnect());
   }, []);

   useEffect(() => {
      GetQuantitySelected();
   }, [GetCartSingleItem]);

   useEffect(() => {
      setSelectedColor({ hex: findProduct?.colorVariants[0].hex || "", images: findProduct?.colorVariants[0].images || [] });
      setSelectedMaterials(findProduct?.material[0] || "");
   }, []);

   // Update Quantity
   const handleIncreaseQuantity = () => {
      const updateProductQuantity = quantity < (findProduct?.stock ?? 0) ? quantity + 1 : quantity;
      setQuantity(updateProductQuantity);
      updateQuantity(findProduct?.id || "", updateProductQuantity, selectedColor.hex, selectedMaterials);
   };

   const handleDecreaseQuantity = () => {
      const updateProductQuantity = quantity <= 1 ? 1 : quantity - 1;
      setQuantity(updateProductQuantity);
      updateQuantity(findProduct?.id || "", updateProductQuantity, selectedColor.hex, selectedMaterials);
   };

   const images = [1, 2, 3, 4, 5, 6, 7, 8];

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
      <section className="  flex relative items-start xl:gap-12 gap-5 max-md:flex-col">
         <div className="lg:pl-5 pl-0 flex flex-col xl:w-auto w-15 gap-2 max-xl:items-center max-xl:justify-center sticky top-30 max-xl:h-[calc(100vh-150px)] overflow-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[950px]:hidden">
            {images.map((_, i) => (
               <div
                  key={i}
                  onClick={() => scrollToImage(i)} // 👈 yeh add karo
                  className="cursor-pointer"
               >
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" className={`xl:flex hidden border transition-all duration-300 ${activeIndex === i ? "border-textBlack" : "border-transparent"}`} />
                  <div className={`w-4 h-4 bg-transparent border border-textBlack rounded-full xl:hidden flex justify-center items-center `}>
                     <div className={`rounded-full transition-all duration-300 ${activeIndex === i ? "bg-textBlack  w-full h-full" : "bg-transparent  w-0 h-0"}`} />
                  </div>
               </div>
            ))}
         </div>
         <div className="flex-col gap-5 md:flex hidden">
            {images.map((_, i) => (
               <div
                  key={i}
                  ref={(el) => {
                     imageRefs.current[i] = el;
                  }}
               >
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={800} height={1000} alt="Product side image" />
               </div>
            ))}
         </div>
         <div className="md:hidden w-full">
            {/* Scroller */}
            <div className="overflow-hidden " onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
               <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                  {images.map((src, i) => (
                     <div key={i} className="min-w-full">
                        <Image src={"/Dummy/Product/ProductImg2.png"} width={800} height={1000} alt={`Product image ${i + 1}`} className="w-full object-cover" />
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
               <h3 className="text-[20px]! text-headingColor">Rs {findProduct?.price}</h3>
            </div>
            <p className="text-textBlack">
               A lightweight Italian leather carryall with the most crucial feature A lightweight Italian leather carryall with the most crucial feature A lightweight Italian leather carryall with the most crucial feature A lightweight Italian leather carryall with the most crucial feature A
               lightweight Italian leather carryall with the most crucial feature A lightweight Italian leather carryall with the most crucial feature A lightweight Italian leather carryall with the most crucial feature A lightweight Italian leather carryall with the most crucial feature A
               lightweight Italian leather carryall with the most crucial feature A lightweight Italian leather carryall with the most crucial feature A lightweight Italian leather carryall with the most crucial feature A lightweight Italian leather carryall with the most crucial feature
            </p>
            <div className="flex flex-col gap-5">
               <div className="flex flex-col gap-2">
                  <p className="text-headingColor">Color - Green</p>
                  <div className="flex items-center flex-wrap gap-2">
                     {findProduct?.colorVariants?.map((item, i) =>
                        selectedColor.hex === item.hex ? (
                           <div className="w-6 h-6 border-2 border-gray-500 cursor-pointer  rounded-full flex items-center justify-center" key={item.hex}>
                              <div className={`w-4 h-4 rounded-full ${item.hex}`} style={{ background: item.hex }} />
                           </div>
                        ) : (
                           <div onClick={() => setSelectedColor({ hex: item.hex, images: item.images })} className={`w-6 h-6 cursor-pointer rounded-full ${item.hex}`} style={{ background: item.hex }} key={i} />
                        ),
                     )}
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <p className="text-headingColor">Material:</p>
                  <div className="flex items-center flex-wrap  gap-3.5">
                     {findProduct?.material.map((materials, i) => (
                        <div key={i} className={`cursor-pointer active:scale-99 py-2 px-6 rounded-full border-2 ${selectedMaterials === materials ? "border-BtnBlack bg-BtnBlack" : "border-gray-400 bg-white"} `} onClick={() => setSelectedMaterials(materials)}>
                           <p className={`${selectedMaterials === materials ? "text-white" : "text-textBlack"}  tracking-wide`}>{materials}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="flex gap-5 2xl:w-150 max-md:flex-col">
               <div className="flex items-center gap-3 px-6 py-2 border-2 border-gray-400 rounded-full w-fit">
                  <Minus
                     className="w-4 h-4 cursor-pointer"
                     onClick={() => {
                        if (GetCartSingleItem) {
                           handleDecreaseQuantity();
                        } else {
                           setQuantity((prev) => prev - 1);
                        }
                     }}
                  />
                  <p>{GetCartSingleItem != undefined ? GetCartSingleItem?.quantity : quantity}</p>
                  <Plus
                     onClick={() => {
                        if (GetCartSingleItem) {
                           handleIncreaseQuantity();
                        } else {
                           setQuantity((prev) => (prev < (findProduct?.stock ?? 0) ? prev + 1 : prev));
                        }
                     }}
                     className="w-4 h-4 cursor-pointer"
                  />
               </div>
               <Button
                  name={GetCartSingleItem ? "Already In Bag" : "Add To Bag"}
                  className="w-full"
                  disabled={GetCartSingleItem ? true : false}
                  onClick={() => {
                     addToCart(
                        {
                           id: findProduct?.id || "",
                           name: findProduct?.name || "",
                           images: findProduct?.images?.[0] || "",
                           colorVariants: selectedColor.hex || "",
                           material: selectedMaterials,
                           price: findProduct?.price ?? 0,
                           stock: findProduct?.stock || 0,
                        },
                        quantity,
                     );
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
                           {products.map((item) => (
                              <AccessoriesCard selectedColor={selectedColor} selectedMaterials={selectedMaterials} product={item} isButton key={item?.id + item.badge} />
                           ))}
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
