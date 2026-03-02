"use client";
import { TextAlignJustify } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Header = () => {
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

   return (
      <header className={`lg:px-10 px-5 h-17.5 flex items-center border-b justify-between border-b-gray-200 fixed w-full z-50 bg-white transition-all duration-75 ${scrolled ? "top-0!" : "top-11"}`}>
         <TextAlignJustify className="lg:hidden min-[500px]:w-auto w-[6vw] min-[500px]:hidden flex" />
         <div className="flex items-center gap-10">
            <TextAlignJustify className="lg:hidden hidden min-[500px]:w-auto w-[6vw] min-[500px]:flex" />
            <Image src={"/Common/Logo.png"} width={200} height={200} alt="logo image here" className="lg:w-50 min-[500px]:w-48 w-[40vw] h-auto" />
            <ul className="items-center gap-6 lg:flex hidden">
               <li className="cursor-pointer text-textBlack">
                  <a href="/shop">Shop</a>
               </li>
               <li className="cursor-pointer text-[#6B4613]">New Arrivals</li>
               <li className="cursor-pointer text-[#840D0D]">Archive Sale</li>
            </ul>
         </div>
         <div className="flex items-center sm:gap-6 gap-3">
            <span className="lg:border-b border-0 border-[#B0B0B0]  pb-1 mt-1! min-[500px]:flex hidden">
               <input type="text" className="outline-none text-[14px] text-textBlack lg:flex hidden" placeholder="Search" />
               <Image src={"/Icons/SearchIcon.svg"} width={16} height={16} alt="profile icon" className="lg:w-4 sm:w-4.5 w-[3.2vw]" />
            </span>
            <Image src={"/Icons/ProfileIcon.svg"} width={20} height={20} alt="profile icon" className="sm:w-5 w-[3.2vw] min-w-4" />
            <Image src={"/Icons/HeartIcon.svg"} width={20} height={20} alt="profile icon" className="sm:w-5 w-[3.2vw] min-w-4" />
            <span className="flex items-center gap-1.5">
               <Image src={"/Icons/BagIcon.svg"} width={20} height={20} alt="profile icon" className="sm:w-5 w-[3.2vw] min-w-4" />0
            </span>
         </div>
      </header>
   );
};

export default Header;
