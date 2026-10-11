import { Variant } from "@/Types/Notification/notification.types";
import React from "react";

export const icons: Record<Variant, React.ReactNode> = {
   info: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
         <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
         <path d="M9 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
         <circle cx="9" cy="5.5" r="0.75" fill="currentColor" />
      </svg>
   ),
   success: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
         <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
         <path d="M5.5 9l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
   ),
   warning: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
         <path d="M9 2L16.5 15H1.5L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
         <path d="M9 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
         <circle cx="9" cy="12.5" r="0.75" fill="currentColor" />
      </svg>
   ),
   error: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
         <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
         <path d="M6 6l6 6M12 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
   ),
};

export const variantStyles: Record<Variant, string> = {
   info: "bg-blue-50   border-blue-200   text-blue-800",
   success: "bg-green-50  border-green-200  text-green-800",
   warning: "bg-amber-50  border-amber-200  text-amber-800",
   error: "bg-red-50    border-red-200    text-red-800",
};

export const btnStyles: Record<Variant, string> = {
   info: "border-blue-300   text-blue-800   hover:bg-blue-100",
   success: "border-green-300  text-green-800  hover:bg-green-100",
   warning: "border-amber-300  text-amber-800  hover:bg-amber-100",
   error: "border-red-300    text-red-800    hover:bg-red-100",
};

export const bannerBorder: Record<Variant, string> = {
   info: "border-blue-400",
   success: "border-green-400",
   warning: "border-amber-400",
   error: "border-red-400",
};
