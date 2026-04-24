"use client";
import { useCartStore } from "@/Storage/UseCartStore";
import { useFavoriteStore } from "@/Storage/UseFavoriteStore";
import { Minus, Plus, TextAlignJustify, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type LeafItem = { name: string; href: string };
type NestedItem = { label: { name: string; href: string }; children: LeafItem[] | NestedItem[] };

const Header = ({ setIsSidebarOpen, setIsFavoriteOpen }: { setIsSidebarOpen: (isOpen: boolean) => void; setIsFavoriteOpen: (isOpen: boolean) => void }) => {
   const [isNavbar, setIsNavbar] = useState(false);
   const [isSidebar, setIsSidebar] = useState(false);
   const [scrolled, setScrolled] = useState(false);

   const TOPBAR_HEIGHT = 15;

   const menuData: { label: { name: string; href: string }; children: (LeafItem | NestedItem)[] }[] = [
      {
         label: { name: "Shop", href: "" },
         children: [
            {
               label: { name: "Categories", href: "" },
               children: [
                  { name: "Bags", href: "/collection/shop" },
                  { name: "Clothing", href: "/collection/shop" },
                  { name: "Small Leather Goods", href: "/collection/shop" },
                  { name: "Accessories", href: "/collection/shop" },
                  { name: "Shop All", href: "/collection/shop" },
               ],
            },
            { label: { name: "Featured", href: "/featured" }, children: [] },
            { label: { name: "Gifting", href: "/gifting" }, children: [] },
         ],
      },
   ];

   function AccordionItem({ label, children, depth = 0 }: { label: { name: string; href: string }; children?: (LeafItem | NestedItem)[]; depth?: number }) {
      const [open, setOpen] = useState(depth === 0);
      const hasChildren = children && children.length > 0;

      return (
         <div className={`${depth === 0 ? "border-b border-gray-200" : ""}`}>
            {/* Row */}
            <div className={`flex items-center justify-between cursor-pointer ${depth === 0 ? "py-4 px-5" : depth === 1 ? "py-3 pl-6 pr-5" : "py-2 px-11"}`} onClick={() => hasChildren && setOpen((p) => !p)}>
               {hasChildren && <a className={`${depth === 0 ? "text-[15px] text-textBlack!" : depth === 1 ? "text-[14px]  text-textBlack!" : "text-[13px] text-textBlack!"}`}>{label.name}</a>}
               {!hasChildren && (
                  <a href={label.href} className={`${depth === 0 ? "text-[15px] text-textBlack!" : depth === 1 ? "text-[14px]  text-textBlack!" : "text-[13px] text-textBlack!"}`}>
                     {label.name}
                  </a>
               )}
               {hasChildren && (open ? <Minus size={16} className="text-gray-500 shrink-0" /> : <Plus size={16} className="text-gray-500 shrink-0" />)}
            </div>

            {/* Children */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open && hasChildren ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
               <div className={`${depth === 1 ? "border-l border-gray-200 ml-6 mb-3" : ""}`}>
                  {children?.map((child, i) => {
                     // Leaf node — { name, href }
                     if ("name" in child) {
                        return (
                           <a key={i} href={child.href} className="block py-2 px-5 text-[13px]! text-gray-500 hover:text-gray-800 transition-colors">
                              {child.name}
                           </a>
                        );
                     }
                     // Nested AccordionItem
                     return <AccordionItem key={i} label={child.label} children={child.children as (LeafItem | NestedItem)[]} depth={depth + 1} />;
                  })}
               </div>
            </div>
         </div>
      );
   }

   useEffect(() => {
      const onScroll = () => {
         setScrolled(window.scrollY > TOPBAR_HEIGHT);
      };

      onScroll();

      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
   }, []);

   useEffect(() => {
      if (isNavbar) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "auto"; // ← sirf tab jab dono false hon
      }

      return () => {
         document.body.style.overflow = "auto";
      };
   }, [isNavbar]);

   useEffect(() => {
      if (isSidebar) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "auto"; // ← sirf tab jab dono false hon
      }

      return () => {
         document.body.style.overflow = "auto";
      };
   }, [isSidebar]);

   const totalCartItems = useCartStore((state) => state.items.length);
   const totalFavoriteItems = useFavoriteStore((state) => state.favorites.length);

   return (
      <>
         <header onMouseLeave={() => setIsNavbar(false)} className={`lg:px-10 px-5 h-17.5 flex z-60! items-center border-b justify-between border-b-gray-200 fixed w-full  bg-white transition-all duration-75  ${scrolled ? "top-0!" : "top-11"}`}>
            <TextAlignJustify className="xl:hidden min-[500px]:w-auto w-[6vw] min-[500px]:hidden flex" onClick={() => setIsSidebar(true)} />
            <div className="flex items-center gap-10">
               <TextAlignJustify className="xl:hidden hidden min-[500px]:w-auto w-[6vw] min-[500px]:flex" onClick={() => setIsSidebar(true)} />
               <Image src={"/Common/Logo.png"} width={200} height={200} alt="logo image here" className="lg:w-50 min-[500px]:w-48 w-[40vw] h-auto" />
               <ul className="items-center gap-6 xl:flex hidden">
                  <li className="cursor-pointer text-textBlack" onMouseEnter={() => setIsNavbar(true)}>
                     <a href="/collection/shop">Shop</a>
                  </li>
                  <li className="cursor-pointer text-[#6B4613]">New Arrivals</li>
                  <li className="cursor-pointer text-[#840D0D]">Archive Sale</li>
               </ul>
            </div>
            <div className="flex items-center sm:gap-6 gap-3">
               <span className="lg:border-b border-0 border-[#B0B0B0]  pb-1 mt-1! min-[500px]:flex hidden cursor-pointer">
                  <input type="text" className="outline-none text-[14px] text-textBlack lg:flex hidden" placeholder="Search" />
                  <Image src={"/Icons/SearchIcon.svg"} width={16} height={16} alt="profile icon" className="lg:w-4 sm:w-4.5 w-[3.2vw]" />
               </span>
               <Image src={"/Icons/ProfileIcon.svg"} width={20} height={20} alt="profile icon" className="sm:w-5 w-[3.2vw] min-w-4 cursor-pointer" />
               {/* <Image src={"/Icons/HeartIcon.svg"} width={20} height={20} alt="profile icon" className="sm:w-5 w-[3.2vw] min-w-4 cursor-pointer" /> */}
               <span className="flex items-center gap-1.5 cursor-pointer" onClick={() => setIsFavoriteOpen(true)}>
                  <Image src={"/Icons/HeartIcon.svg"} width={20} height={20} alt="profile icon" className="sm:w-5 w-[3.2vw] min-w-4" />
                  {totalFavoriteItems || 0}
               </span>
               <span className="flex items-center gap-1.5 cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
                  <Image src={"/Icons/BagIcon.svg"} width={20} height={20} alt="profile icon" className="sm:w-5 w-[3.2vw] min-w-4" />
                  {totalCartItems || 0}
               </span>
            </div>
            <nav
               onMouseEnter={() => setIsNavbar(true)}
               className={` xl:h-120  xl:px-10! bg-white absolute xl:w-full md:w-90 sm:w-[50vw] w-full xl:top-17.5 xl:left-0 ${scrolled ? "top-0" : "-top-11"} ${isSidebar ? " max-xl:-translate-x-10 max-lg:-translate-x-5 opacity-100 transition-all duration-300 h-screen" : "max-xl:-translate-x-[120%] transition-all duration-300 h-screen"} xl:px-5 flex gap-10 xl:py-10 transition-all duration-300  ${!isSidebar && !isNavbar ? "pointer-events-none" : ""} ${isNavbar ? "opacity-100" : "opacity-0 "}`}
            >
               <div className=" flex gap-10 w-full max-xl:flex-col">
                  <div className="border-b border-gray-200 xl:hidden  py-6">
                     <div className="flex items-center px-4 justify-between">
                        <h3>Sidebar</h3>
                        <X
                           className="text-textBlack"
                           size={24}
                           onClick={() => {
                              setIsSidebar(false);
                           }}
                        />
                     </div>
                  </div>
                  <Image src={"/Common/Logo.png"} width={200} height={200} alt="logo image here" className="lg:w-50 min-[500px]:w-48 w-[40vw] h-auto opacity-0 xl:flex hidden " />
                  <div className=" xl:justify-between w-full max-lg:px-5 xl:flex hidden">
                     <div className="flex gap-10 max-xl:flex-col">
                        <div className="flex flex-col gap-4 max-md:place-self-start  max-sm:place-self-start! max-sm:pl-0">
                           <strong className="fontInterSemiBold text-headingColor">Categories</strong>
                           <ul className="flex flex-col gap-2">
                              <li>
                                 <Link href={"/contact-us"} className="hover:underline">
                                    Contact Us
                                 </Link>
                              </li>
                              <li>
                                 <Link href={"/frequently-asked-questions"} className="hover:underline">
                                    FAQs
                                 </Link>
                              </li>
                              <li>Shipping & Delivery</li>
                              <li>Returns & Exchanges</li>
                              <li>Order Tracking</li>
                           </ul>
                        </div>
                        <div className="flex flex-col gap-4 max-md:place-self-start  max-sm:place-self-start! max-sm:pl-0">
                           <strong className="fontInterSemiBold text-headingColor">Categories</strong>
                           <ul className="flex flex-col gap-2">
                              <li>
                                 <Link href={"/contact-us"} className="hover:underline">
                                    Contact Us
                                 </Link>
                              </li>
                              <li>
                                 <Link href={"/frequently-asked-questions"} className="hover:underline">
                                    FAQs
                                 </Link>
                              </li>
                              <li>Shipping & Delivery</li>
                              <li>Returns & Exchanges</li>
                              <li>Order Tracking</li>
                           </ul>
                        </div>
                     </div>
                     <Image src={"/Dummy/Product/ProductImg2.png"} width={400} height={200} alt="logo image here" className="lg:w-72 min-[500px]:w-52 w-[40vw] h-full xl:flex hidden" />
                  </div>
                  <div className="xl:hidden">
                     <div className="w-full">
                        {menuData.map((item, i) => (
                           <AccordionItem
                              key={i}
                              label={item.label} // { name: "Shop", href: "..." }
                              children={item.children} // nested array
                              depth={0}
                           />
                        ))}
                     </div>
                  </div>
               </div>
            </nav>
         </header>
         <div className={`bg-black/10 ${!isNavbar ? "h-0 w-0 " : "h-screen w-screen z-50"}  transition-all duration-75  fixed top-0 left-0 max-xl:hidden`} />
         <div className={`bg-black/10 ${!isSidebar ? "h-screen w-screen opacity-0 pointer-events-none" : "h-screen w-screen z-50"} transition-all duration-300  fixed top-0 left-0 xl:hidden`} onClick={() => setIsSidebar(false)} />
      </>
   );
};

export default Header;
