"use client";
import Accordion from "@/components/Accordion/Accordion";
import Button from "@/components/Button/Button";
import ProductCard from "@/components/Cards/ProductCard/ProductCard";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/layout/MainLayout";
import { ChevronDown, CircleGauge, Minus, Plus } from "lucide-react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Image from "next/image";
import { products } from "../../../../DummyData/Products.json";
import React, { useEffect, useEffectEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/Storage/UseCartStore";
import AccessoriesCard from "@/components/Cards/AccessoriesCard/AccessoriesCard";

const page = () => {
   const [selectedColor, setSelectedColor] = useState<{ hex: string; image: string }>({ hex: "", image: "" });
   const [selectedMaterials, setSelectedMaterials] = useState<string>("");
   const [showAccessories, setShowAccessories] = useState<boolean>(false);
   const [quantity, setQuantity] = useState(1);
   const [accordion, setAccordion] = useState<number | null>();

   const { id } = useParams();

   const colors: string[] = ["bg-blue-400", "bg-green-400", "bg-purple-400", "bg-cyan-400"];
   const materials = ["Pebbled", "Pinacle Special", "Shimmer", "New Arrival"];

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

   const GetCartSingleItem = useCartStore((state) => state.items.find((item) => item.id === findProduct?.id && item.color.hex === selectedColor.hex && item.material === selectedMaterials));

   const GetQuantitySelected = useEffectEvent(() => {
      setQuantity(GetCartSingleItem?.quantity || 1);
   });

   useEffect(() => {
      GetQuantitySelected();
   }, [GetCartSingleItem]);

   useEffect(() => {
      setSelectedColor({ hex: findProduct?.colors[0].hex || "", image: findProduct?.colors[0].image || "" });
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

   return (
      <MainLayout>
         <div className="flex flex-col gap-17.5 lg:px-10 px-5 py-17.5">
            <section className="  flex relative items-start gap-12 ">
               <div className="flex flex-col gap-2  sticky top-30 h--[calc(100vh-150px)] overflow-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
                  <Image src={"/Dummy/Product/ProductImg.png"} width={100} height={120} alt="Product side image" />
               </div>
               <div className="flex flex-col gap-5">
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={700} height={900} alt="Product side image" />
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={700} height={900} alt="Product side image" />
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={700} height={900} alt="Product side image" />
                  <Image src={"/Dummy/Product/ProductImg2.png"} width={700} height={900} alt="Product side image" />
               </div>
               <div className="flex flex-col gap-10 w-200 sticky top-10 max-h-[calc(100vh-50px)] pb-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                        <div className="flex items-center  gap-2">
                           {findProduct?.colors?.map((item, i) =>
                              selectedColor.hex === item.hex ? (
                                 <div className="w-6 h-6 border-2 border-gray-500 cursor-pointer  rounded-full flex items-center justify-center" key={item.hex}>
                                    <div className={`w-4 h-4 rounded-full ${item.hex}`} style={{ background: item.hex }} />
                                 </div>
                              ) : (
                                 <div onClick={() => setSelectedColor({ hex: item.hex, image: item.image })} className={`w-6 h-6 cursor-pointer rounded-full ${item.hex}`} style={{ background: item.hex }} key={i} />
                              ),
                           )}
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <p className="text-headingColor">Material:</p>
                        <div className="flex items-center  gap-3.5">
                           {findProduct?.material.map((materials, i) => (
                              <div key={i} className={`cursor-pointer active:scale-99 py-2 px-6 rounded-full border-2 ${selectedMaterials === materials ? "border-BtnBlack bg-BtnBlack" : "border-gray-400 bg-white"} `} onClick={() => setSelectedMaterials(materials)}>
                                 <p className={`${selectedMaterials === materials ? "text-white" : "text-textBlack"}  tracking-wide`}>{materials}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-5 w-150">
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
                                 image: findProduct?.images?.[0] || "",
                                 color: selectedColor,
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
            <section className="flex items-center justify-around py-17.5 border-y border-gray-300">
               <div className="text-center w-100">
                  <h2>Everyday Elegance</h2>
                  <p>Our Circle Keychain adds a refined touch to your daily essentials. Designed with an easy ring clip, it attaches effortlessly to your keys.</p>
               </div>
               <div className="text-center w-100">
                  <h2>Exclusive Discounts</h2>
                  <p>Made in Turkey from premium Italian leather, each piece is crafted by world-class artisans at one of the oldest family owned.</p>
               </div>
               <div className="text-center w-100">
                  <h2>Built to Last</h2>
                  <p>Crafted using LWG-certified leather from the Leather Working Group, ensuring environmentally responsible tanning processes.</p>
               </div>
            </section>
            <section className="flex flex-col gap-17.5 items-center">
               <h2 className="uppercase">you may be intrested in</h2>
               <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4  gap-y-21.25">
                  {products.slice(0, 4).map((item, i) => (
                     <ProductCard key={i} data={item} />
                  ))}
               </div>
               <Pagination>
                  <PaginationContent>
                     <PaginationItem>
                        <PaginationPrevious />
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationLink>1</PaginationLink>
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationLink isActive>2</PaginationLink>
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationLink>3</PaginationLink>
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationEllipsis />
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationNext />
                     </PaginationItem>
                  </PaginationContent>
               </Pagination>
            </section>
            <div className="w-full h-px bg-gray-300" />
            <section className="flex flex-col gap-17.5 items-center">
               <h2 className="uppercase">you may be intrested in</h2>

               <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4  gap-y-21.25">
                  {products.slice(0, 4).map((item, i) => (
                     <ProductCard key={i} data={item} />
                  ))}
               </div>
               <Pagination>
                  <PaginationContent>
                     <PaginationItem>
                        <PaginationPrevious />
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationLink>1</PaginationLink>
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationLink isActive>2</PaginationLink>
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationLink>3</PaginationLink>
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationEllipsis />
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationNext />
                     </PaginationItem>
                  </PaginationContent>
               </Pagination>
            </section>
         </div>
      </MainLayout>
   );
};

export default page;
