"use client";
import Button from "@/components/Button/Button";
import CheckoutCards from "@/components/Cards/CheckoutCards/CheckoutCards";
import SidebarCard from "@/components/Cards/SidebarCard/SidebarCard";
import Field from "@/components/InputField/Field";
import MainLayout from "@/layout/MainLayout";
import { useCartStore } from "@/Storage/UseCartStore";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Checkout = () => {
   const [mobileCheckout, setMobileCheckout] = useState<Boolean>(false);
   const [isShipping, setIsShipping] = useState<Boolean>(false);
   const [paymentThrough, setPaymentThrough] = useState<"bank" | "cash" | "">("");

   const cartItems = useCartStore((state) => state.items);

   return (
      <MainLayout isHeader={false} isFooter={false}>
         <div className="lg:flex lg:flex-row flex-col ">
            <div className=" py-5 border-b border-gray-200 lg:px-0 sm:px-20 px-5 lg:hidden flex">
               <Image src={"/Common/Logo.png"} width={250} height={250} alt="website logo" />
            </div>
            <div className="lg:hidden  py-7 flex items-center justify-between border-b border-gray-200 bg-staticSecondaryBG lg:px-0 sm:px-20 px-5">
               <span className="flex items-center gap-1" onClick={() => setMobileCheckout(!mobileCheckout)}>
                  <h4 className="text-lightText">Order summary</h4>
                  <ChevronDown className={`pt-1 ${mobileCheckout ? "-rotate-180" : "rotate-0"} transition-all duration-500`} />
               </span>
               <h3>Rs 11,999</h3>
            </div>
            <div className={`lg:hidden ${mobileCheckout ? "max-h-400 opacity-100 py-5" : "max-h-0 opacity-0 py-0 overflow-hidden"}  transition-all duration-700 flex w-full bg-staticSecondaryBG xl:px-20 sm:px-20 px-5 flex-col gap-10`}>
               <div className="flex flex-col gap-4">
                  <Image src={"/Common/Logo.png"} width={250} height={250} alt="website logo" />
                  <h3 className="uppercase md:text-[20px]! text-headingColor">Review your Bag</h3>
               </div>
               <div className="flex flex-col gap-6">
                  <div className=" max-h-[80vh] overflow-y-auto overflow-x-hidden flex flex-col gap-6 pb-10!">{cartItems.length > 0 && cartItems.map((item) => <CheckoutCards product={item} quantity={item.quantity} key={item.id + item.color + item.material} />)}</div>
                  <div className="flex flex-col gap-4 ">
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]">Subtotal</p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600 }}>
                           $45.00
                        </p>
                     </span>
                     <span className="flex justify-between ">
                        <p className="text-[#5E5F5F]">Shipping</p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600 }}>
                           $45.00
                        </p>
                     </span>
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]">Discount</p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600 }}>
                           $45.00
                        </p>
                     </span>
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]" style={{ fontFamily: "InterSemiBold", fontWeight: 600, fontSize: 16 }}>
                           Total
                        </p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600, fontSize: 16 }}>
                           $45.00
                        </p>
                     </span>
                  </div>
               </div>
               <div className=" flex">
                  <Button name="Pay Now" mainClass="w-full" />
               </div>
               <div className="sm:w-110 flex flex-col gap-6">
                  <span className="flex flex-col gap-2">
                     <h4 className="text-headingColor">Satisfaction Guaranteed</h4>
                     <p className="text-textBlack">We offer a two-year warranty on leather bags and accessories and a one-year warranty on all other products.</p>
                  </span>
                  <span className="flex flex-col gap-2">
                     <h4 className="text-headingColor">Responsibly Made</h4>
                     <p className="text-textBlack">Our luxurious leather is LWG certified, ensuring the leather is tanned responsibly.</p>
                  </span>
                  <span className="flex flex-col gap-2">
                     <h4 className="text-headingColor">Easy Returns</h4>
                     <p className="text-textBlack">Return locations available in all major US cities, return within 30 days.</p>
                  </span>
               </div>
            </div>
            <div className="lg:w-2/4 w-full bg-white 2xl:px-40 xl:px-20 sm:px-20 px-5 lg:py-18 py-5 flex-col lg:gap-10 gap-6 flex">
               <div className="flex flex-col gap-4">
                  <h4 className="text-lightText lg:hidden flex">Cart / Shipping / Payment</h4>
                  <p className="text-lightText lg:flex hidden">Cart / Shipping / Payment</p>
                  <h2 className="uppercase text-headingColor">Checkout</h2>
               </div>

               <div className="flex flex-col gap-3">
                  <h3 className="lg:text-[20px]! text-headingColor">Contact</h3>
                  <div className="flex flex-col gap-2">
                     <h4 className="text-headingColor">Phone Number</h4>
                     <Field type="number" placeHolder="Enter Phone Number" />
                  </div>
               </div>
               <div className="flex flex-col gap-3">
                  <h3 className="lg:text-[20px]! text-headingColor">Delivery Method</h3>
                  <div className=" gap-2 border-2 border-gray-200 flex items-center rounded-sm px-3 py-3 cursor-pointer group " onClick={() => setIsShipping(!isShipping)}>
                     <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-gray-500">
                        <div className={`${isShipping ? "w-2 h-2" : "w-0 h-0"} transition-all duration-200 rounded-full bg-BtnBlack`} />
                     </div>
                     <p className={`${isShipping ? "text-textBlack" : "text-gray-400"} transition-all duration-300 text-sm! font-normal! group-active:scale-95`}>Shipping</p>
                  </div>
               </div>
               <div className="flex flex-col gap-3">
                  <h3 className="lg:text-[20px]! text-headingColor">Shipping Information</h3>
                  <div className="flex flex-col gap-4.5">
                     <div className="flex items-center gap-5">
                        <div className="flex flex-col gap-2 w-full">
                           <h4 className="text-headingColor">Full name</h4>
                           <Field type="text" placeHolder="Enter full name" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                           <h4 className="text-headingColor">Last name</h4>
                           <Field type="number" placeHolder="Enter last name" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <h4 className="text-headingColor">Address</h4>
                        <Field type="text" placeHolder="Enter Your Address" />
                     </div>
                     <div className="flex items-center gap-5">
                        <div className="flex flex-col gap-2 w-full">
                           <h4 className="text-headingColor">City</h4>
                           <Field type="text" placeHolder="Enter city" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                           <h4>State</h4>
                           <Field type="text" placeHolder="Enter state" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <h4 className="text-headingColor">Email address (Optional)</h4>
                        <Field type="email" placeHolder="Enter email address" />
                     </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 accent-BtnBlack" />
                        <p className="text-textBlack">I have read and agree to the Terms and Conditions.</p>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col gap-3">
                  <h3 className="lg:text-[20px]! text-headingColor">Payment</h3>
                  <div className="flex flex-col  border border-gray-300 rounded-md overflow-hidden">
                     <div
                        className="border-b border-gray-300  py-3 cursor-pointer "
                        onClick={(e) => {
                           e.stopPropagation();
                           setPaymentThrough((prev) => (prev === "bank" ? "" : "bank"));
                        }}
                     >
                        <span className={`${paymentThrough === "bank" && "pb-3"} flex items-center gap-1 px-3`}>
                           <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-gray-500">
                              <div className={`${paymentThrough === "bank" ? "w-2 h-2" : "w-0 h-0"} transition-all duration-200 rounded-full bg-BtnBlack`} />
                           </div>
                           <h4 className="text-headingColor">Bank</h4>
                        </span>
                        <p className={`${paymentThrough === "bank" ? "max-h-100 opacity-100 border-t border-gray-300 pt-3" : "max-h-0 opacity-0 z-0"} text-lightText  px-3 transition-all duration-300`}>
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                           voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                     </div>
                     <div
                        className="  py-3 cursor-pointer  z-50"
                        onClick={(e) => {
                           e.stopPropagation();
                           setPaymentThrough((prev) => (prev === "cash" ? "" : "cash"));
                        }}
                     >
                        <span className={`${paymentThrough === "cash" && "pb-3"} flex items-center gap-1 px-3`}>
                           <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-gray-500">
                              <div className={`${paymentThrough === "cash" ? "w-2 h-2" : "w-0 h-0"} transition-all duration-200 rounded-full bg-BtnBlack`} />
                           </div>
                           <h4 className="text-headingColor">Cash On Delivery</h4>
                        </span>
                        <p className={`${paymentThrough === "cash" ? "max-h-100 opacity-100 border-t border-gray-300 pt-3" : "max-h-0 opacity-0"} text-lightText  px-3 transition-all duration-300`}>
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                           voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="lg:flex hidden w-2/4 bg-staticSecondaryBG xl:px-20 px-20 py-18  flex-col gap-10">
               <div className="flex flex-col gap-4">
                  <Image src={"/Common/Logo.png"} width={250} height={250} alt="website logo" />
                  <h3 className="uppercase md:text-[20px]! text-headingColor">Review your Bag</h3>
               </div>
               <div className="flex flex-col gap-6">
                  <div className=" max-h-[50vh] overflow-auto pb-10! flex flex-col gap-6">{cartItems.length > 0 && cartItems.map((item) => <CheckoutCards product={item} quantity={item.quantity} key={item.id + item.color + item.material} />)}</div>

                  <div className="flex flex-col gap-4 w-100">
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]">Subtotal</p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600 }}>
                           $45.00
                        </p>
                     </span>
                     <span className="flex justify-between ">
                        <p className="text-[#5E5F5F]">Shipping</p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600 }}>
                           $45.00
                        </p>
                     </span>
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]">Discount</p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600 }}>
                           $45.00
                        </p>
                     </span>
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]" style={{ fontFamily: "InterSemiBold", fontWeight: 600, fontSize: 16 }}>
                           Total
                        </p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600, fontSize: 16 }}>
                           $45.00
                        </p>
                     </span>
                  </div>
               </div>
               <div className="w-100 flex">
                  <Button name="Pay Now" mainClass="w-full" />
               </div>
               <div className="w-110 flex flex-col gap-6">
                  <span className="flex flex-col gap-2">
                     <h4 className="text-headingColor">Satisfaction Guaranteed</h4>
                     <p className="text-textBlack">We offer a two-year warranty on leather bags and accessories and a one-year warranty on all other products.</p>
                  </span>
                  <span className="flex flex-col gap-2">
                     <h4 className="text-headingColor">Responsibly Made</h4>
                     <p className="text-textBlack">Our luxurious leather is LWG certified, ensuring the leather is tanned responsibly.</p>
                  </span>
                  <span className="flex flex-col gap-2">
                     <h4 className="text-headingColor">Easy Returns</h4>
                     <p className="text-textBlack">Return locations available in all major US cities, return within 30 days.</p>
                  </span>
               </div>
            </div>
         </div>
      </MainLayout>
   );
};

export default Checkout;
