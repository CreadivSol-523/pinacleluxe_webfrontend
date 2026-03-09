"use client";
import { Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";
import React, { ReactNode, useState } from "react";

interface FieldProps {
   type?: string;
   disabled?: boolean;
   placeHolder?: string;
   name?: string;
   ref?: any;
   bgColor?: string;
   value?: string;
   className?: string;
   onChange?: any;
   xl?: boolean;
   lg?: boolean;
   md?: boolean;
   isIcon?: boolean;
   row?: number;
   col?: number;
   maxLength?: number;
   StyleColor?: string;
   styles?: any;
   customClass?: string;
   pattern?: string;
   inputCustomClass?: string;
   onKeyPress?: any;
   icon?: ReactNode;
   divStyle?: object;
   isDark?: boolean;
   required?: boolean;
}

const Field = ({ type = "text", disabled, placeHolder, name, ref, bgColor, value, className, onChange, xl, lg, md, isIcon, row, col, maxLength, styles, customClass, pattern, onKeyPress, icon, inputCustomClass, divStyle, isDark = false, required }: FieldProps) => {
   const [showPassword, setShowPassword] = useState(false);
   // input fields

   const inputClassName = `fontInterRegular! outline-none w-full border-[1px] ${isDark ? "dark:border-white border-gray-200" : "border-gray-200"} rounded-sm ${isDark ? "text-textBlack dark:text-white" : "text-textBlack"} lg:text-md text-sm px-3 lg:py-3 py-2 ${bgColor ? bgColor : isDark ? "bg-white dark:bg-layoutDarkBG" : "bg-white"} ${xl ? "sm:w-96 w-4/5" : lg ? "sm:w-80 w-4/5" : md ? "w-64" : "w-48"}`;

   const divClassName = `fontInterRegular! border-[1px] border-gray-200  ${isDark ? "dark:border-white border-gray-200" : "border-gray-200"} w-full rounded-sm outline-none ${isDark ? "text-textBlack dark:text-white" : "text-textBlack"} lg:text-md text-sm lg:py-3 py-2 p-2 relative ${bgColor ? bgColor : isDark ? "bg-white dark:bg-layoutDarkBG" : "bg-white"} ${isIcon ? "px-2" : "pr-2"} flex items-center justify-start ${xl ? "sm:w-96 w-4/5" : lg ? "sm:w-80 w-4/5" : md ? "w-64" : "w-48"}`;

   const textAreaClassName = `w-full ${isDark ? "dark:border-[1px] border-gray-200" : "border-[1px] border-gray-200"} ${isDark ? "text-textBlack dark:text-white" : "text-white"} bg-white dark:bg-layoutDarkBG rounded-sm  px-2 py-1 flex items-center justify-between ${xl ? "w-96" : lg ? "w-80" : md ? "w-64" : "w-48"}`;

   const inputProps = {
      type:
         type === "password"
            ? showPassword
               ? "text"
               : "password"
            : type === "text"
              ? "text"
              : type === "email"
                ? "email"
                : type === "number"
                  ? "number"
                  : type === "range"
                    ? "range"
                    : type === "radio"
                      ? "radio"
                      : type === "checkbox"
                        ? "checkbox"
                        : type === "date"
                          ? "date"
                          : type === "time"
                            ? "time"
                            : type === "url"
                              ? "url"
                              : "text",

      placeholder:
         placeHolder ||
         (type === "password"
            ? "Password"
            : type === "text"
              ? "Text"
              : type === "email"
                ? "Email"
                : type === "number"
                  ? "Number"
                  : type === "range"
                    ? "Range"
                    : type === "radio"
                      ? "Radio"
                      : type === "checkbox"
                        ? "Checkbox"
                        : type === "date"
                          ? "Date"
                          : type === "time"
                            ? "Time"
                            : type === "url"
                              ? "URL"
                              : "Text"),

      style: { ...styles },
      name: name,
      maxLength: maxLength,
      disabled: disabled,
      ...(onChange ? { value, onChange } : { defaultValue: value }),
      pattern: pattern,
      className: className ? `${inputClassName} ${className}` : type === "password" || isIcon ? `w-full ${inputClassName}` : customClass ? customClass : `${inputClassName}`,
      onKeyPress: onKeyPress,
      required: required,
   };

   const divProps = {
      className: customClass ? customClass : `${divClassName} ${className}`,
   };

   const textareaProps = {
      className: customClass ? customClass : `${textAreaClassName} ${className}`,
      placeholder: placeHolder,
      disabled: disabled,
      style: { ...styles },
      rows: row,
      cols: col,
      name: name,
      ...(onChange ? { value, onChange } : { defaultValue: value }),
   };

   return (
      <>
         {type === "password" ? (
            <div {...divProps} style={divStyle} className={`${customClass || divClassName} flex items-center`}>
               {icon}
               <input {...{ ...inputProps, className: inputCustomClass || "w-full", style: { fontFamily: "InterRegular" } }} className="outline-none w-full " autoComplete="off" />

               <div onClick={() => setShowPassword(!showPassword)} className="cursor-pointer flex-shrink-0 ml-2">
                  {showPassword ? <Eye className="text-gray-500 hover:text-[#000] transition-colors" size={18} /> : <EyeOff className="text-gray-500 hover:text-[#808fa2] transition-colors" size={18} />}
               </div>
            </div>
         ) : isIcon ? (
            <div {...divProps} style={divStyle}>
               {icon}
               <input {...{ ...inputProps, className: inputCustomClass, style: { fontFamily: "InterRegular" } }} autoComplete="off" />
            </div>
         ) : type === "textarea" ? (
            <textarea {...textareaProps} autoComplete="off" className="outline-none border  border-gray-200 text-white w-full rounded-sm p-3 sm:text-[sm]! text-sm!" />
         ) : (
            <div className="rounded-md overflow-hidden border border-gray-200" style={divStyle}>
               <input {...inputProps} style={{ fontFamily: "InterRegular" }} ref={ref} autoComplete="off" />
            </div>
         )}
      </>
   );
};

export default dynamic(() => Promise.resolve(Field), { ssr: false });
