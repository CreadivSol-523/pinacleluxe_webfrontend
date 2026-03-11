"use client";
import { useCartStore } from "@/Storage/UseCartStore";
import { TextAlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header = ({ setIsSidebarOpen }: { setIsSidebarOpen: (isOpen: boolean) => void }) => {
   const [isNavbar, setIsNavbar] = useState(false);
   const TOPBAR_HEIGHT = 15;

   const [scrolled, setScrolled] = useState(false);

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
         document.body.style.overflow = "auto";
      }

      return () => {
         document.body.style.overflow = "auto";
      };
   }, [isNavbar]);

   const totalCartItems = useCartStore((state) => state.items.length);

   return (
      <>
         <header onMouseLeave={() => setIsNavbar(false)} className={`lg:px-10 px-5 h-17.5 flex z-60! items-center border-b justify-between border-b-gray-200 fixed w-full  bg-white transition-all duration-75  ${scrolled ? "top-0!" : "top-11"}`}>
            <TextAlignJustify className="xl:hidden min-[500px]:w-auto w-[6vw] min-[500px]:hidden flex" />
            <div className="flex items-center gap-10">
               <TextAlignJustify className="xl:hidden hidden min-[500px]:w-auto w-[6vw] min-[500px]:flex" />
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
               <Image src={"/Icons/HeartIcon.svg"} width={20} height={20} alt="profile icon" className="sm:w-5 w-[3.2vw] min-w-4 cursor-pointer" />
               <span className="flex items-center gap-1.5 cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
                  <Image src={"/Icons/BagIcon.svg"} width={20} height={20} alt="profile icon" className="sm:w-5 w-[3.2vw] min-w-4" />
                  {totalCartItems || 0}
               </span>
            </div>
            <nav onMouseEnter={() => setIsNavbar(true)} className={`max-xl:hidden h-120 bg-white absolute w-full top-17.5 left-0 lg:px-10 px-5 flex gap-10 py-10 transition-all duration-300  ${isNavbar ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
               <div className=" flex gap-10 w-full">
                  <Image src={"/Common/Logo.png"} width={200} height={200} alt="logo image here" className="lg:w-50 min-[500px]:w-48 w-[40vw] h-auto opacity-0" />
                  <div className="flex justify-between w-full">
                     <div className="flex gap-10">
                        <div className="flex flex-col gap-4 max-md:place-self-start max-md:pl-18 max-sm:place-self-start! max-sm:pl-0">
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
                        <div className="flex flex-col gap-4 max-md:place-self-start max-md:pl-18 max-sm:place-self-start! max-sm:pl-0">
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
                     <Image src={"/Dummy/Product/ProductImg2.png"} width={400} height={200} alt="logo image here" className="lg:w-72 min-[500px]:w-52 w-[40vw] h-full " />
                  </div>
               </div>
            </nav>
         </header>
         <div className={`bg-black/10 ${!isNavbar ? "h-0 w-0 " : "h-screen w-screen z-50"} transition-all duration-75  fixed top-0 left-0`} />
      </>
   );
};

export default Header;
