"use client";

import React from "react";
import dynamic from "next/dynamic";
import { LoaderPinwheelIcon } from "../ui/AnimatedIcons/Loader";
import Link from "next/link";

interface ButtonProps {
   name?: string;
   bgcolor?: string;
   className?: string;
   disabled?: boolean;
   onClick?: () => void;
   isLoading?: boolean;
   icon?: React.ReactNode;
   textColor?: string;
   style?: React.CSSProperties;
   pClass?: string;
   mainClass?: string;
   type?: "button" | "submit" | "reset";
   isDark?: boolean;
   onMouseEnter?: any;
   onMouseLeave?: any;
   href?: string;
}

const Button = ({ name, bgcolor, className, disabled, onClick, isLoading, icon, textColor, style, pClass, mainClass, type, isDark = false, onMouseEnter, onMouseLeave, href }: ButtonProps) => {
   let btnClass;

   if (disabled) {
      btnClass = `text-sm cursor-not-allowed text-white bg-gray-600! p-3 ${className} px-10`;
   } else if (mainClass) {
      btnClass = mainClass;
   } else {
      btnClass = `p-0 flex items-center justify-center bg-BtnBlack! text-sm ${className} min-[500px]:px-10 px-6 active:scale-[1.01] cursor-pointer`;
   }

   return (
      <button
         className={`${btnClass}  ${textColor} ${bgcolor ? bgcolor : disabled ? "bg-gray-400" : "bg-BtnBlack!"} ${disabled ? "text-white" : "text-primary-color hover:scale-[101%] cursor-pointer"} bg-BtnBlack! transition-all duration-300 `}
         style={{ ...style, paddingBlock: "0.75rem", background: disabled ? "#99a1af " : "#141414" }}
         onClick={() => {
            if (disabled === true || isLoading) {
               return;
            } else if (onClick) {
               return onClick();
            } else {
               return;
            }
         }}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
         disabled={disabled}
         type={`${type ? type : "button"}`}
      >
         {isLoading ? (
            <small className={`flex items-center bg-BtnBlack text-sm justify-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"} font-medium! ${textColor ? textColor : isDark ? "dark:text-textColorLight text-white" : "text-white"} gap-2 ${pClass}`}>
               <LoaderPinwheelIcon isLoading={isLoading} />
               {name && "Loading..."}
            </small>
         ) : icon ? (
            href ? (
               <Link href={href || "/"} className={`${pClass} flex items-center justify-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"} text-sm gap-2 w-full  font-medium! ${textColor ? textColor : isDark ? "dark:text-textColorLight text-white" : "text-white"} `}>
                  {name} {icon}
               </Link>
            ) : (
               <small className={`${pClass} flex items-center justify-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"} text-sm gap-2 w-full  font-medium! ${textColor ? textColor : isDark ? "dark:text-textColorLight text-white" : "text-white"} `}>
                  {name} {icon}
               </small>
            )
         ) : href ? (
            <Link href={href || "/"} className={`${pClass} flex items-center justify-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"} text-sm gap-2 w-full  font-medium! ${textColor ? textColor : isDark ? "dark:text-textColorLight text-white" : "text-white"} `}>
               {name} {icon}
            </Link>
         ) : (
            <small className={`${pClass} flex items-center justify-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"} text-sm gap-2 w-full  font-medium! ${textColor ? textColor : isDark ? "dark:text-textColorLight text-white" : "text-white"} `}>
               {name} {icon}
            </small>
         )}
      </button>
   );
};

export default dynamic(() => Promise.resolve(Button), { ssr: false });
