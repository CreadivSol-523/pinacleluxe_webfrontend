"use client";
import Button from "@/components/Button/Button";
import CheckoutCards from "@/components/Cards/AccessoriesCard/AccessoriesCard";
import SidebarCard from "@/components/Cards/SidebarCard/SidebarCard";
import Field from "@/components/InputField/Field";
import MainLayout from "@/layout/MainLayout";
import { useCartStore } from "@/Storage/UseCartStore";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { createOrderApi } from "@/services/api";

const Checkout = () => {
   const [mobileCheckout, setMobileCheckout] = useState<Boolean>(false);
   const [isShipping, setIsShipping] = useState<Boolean>(true);
   const [paymentThrough, setPaymentThrough] = useState<"bank" | "cash" | "">("cash");

   // Form states
   const [phoneNumber, setPhoneNumber] = useState("");
   const [fullName, setFullName] = useState("");
   const [lastName, setLastName] = useState("");
   const [address, setAddress] = useState("");
   const [city, setCity] = useState("");
   const [stateVal, setStateVal] = useState("");
   const [email, setEmail] = useState("");
   const [agreed, setAgreed] = useState(false);
   const [loading, setLoading] = useState(false);
   const [errorMsg, setErrorMsg] = useState("");
   const [successMsg, setSuccessMsg] = useState("");

   const cartItems = useCartStore((state) => state.items);
   const clearCart = useCartStore((state) => state.clearCart);

   const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 45) * item.quantity, 0);
   const shippingFee = 15;
   const total = subtotal + shippingFee;

   const handlePlaceOrder = async () => {
      setErrorMsg("");
      setSuccessMsg("");

      if (!phoneNumber || !fullName || !address || !city) {
         setErrorMsg("Please fill in all required contact and shipping details.");
         return;
      }

      if (!agreed) {
         setErrorMsg("Please agree to the Terms and Conditions.");
         return;
      }

      if (cartItems.length === 0) {
         setErrorMsg("Your cart is empty.");
         return;
      }

      setLoading(true);
      try {
         const orderItems = cartItems.map((item: any) => ({
            product: item.id || item._id,
            name: item.name || "Luxury Item",
            price: item.price || 45,
            quantity: item.quantity,
            image: item.image || item.images?.[0] || "",
         }));

         const payload = {
            customerDetails: {
               fullName: `${fullName} ${lastName}`.trim(),
               email: email || "customer@pinacleluxe.com",
               phone: phoneNumber,
               address,
               city,
               postalCode: "10001",
               country: stateVal || "United States",
            },
            orderItems,
            paymentMethod: paymentThrough === "bank" ? "Online" : "COD",
            shippingPrice: shippingFee,
         };

         await createOrderApi(payload);
         setSuccessMsg("Order placed successfully! Inventory updated atomically.");
         clearCart();
         setTimeout(() => {
            window.location.href = "/";
         }, 2000);
      } catch (err: any) {
         setErrorMsg(err.message || "Failed to place order.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <MainLayout isHeader={false} isFooter={false} isStyle={false}>
         <div className="lg:flex lg:flex-row flex-col justify-end">
            <div className=" py-5 border-b border-gray-200 lg:px-0 sm:px-20 px-5 lg:hidden flex">
               <Image src={"/Common/Logo.png"} width={250} height={250} alt="website logo" />
            </div>
            <div className="lg:hidden  py-7 flex items-center justify-between border-b border-gray-200 bg-staticSecondaryBG lg:px-0 sm:px-20 px-5">
               <span className="flex items-center gap-1" onClick={() => setMobileCheckout(!mobileCheckout)}>
                  <h4 className="text-lightText">Order summary</h4>
                  <ChevronDown className={`pt-1 ${mobileCheckout ? "-rotate-180" : "rotate-0"} transition-all duration-500`} />
               </span>
               <h3>${total.toFixed(2)}</h3>
            </div>
            <div className={`lg:hidden ${mobileCheckout ? "max-h-400 opacity-100 py-5" : "max-h-0 opacity-0 py-0 overflow-hidden"}  transition-all duration-700 flex w-full bg-staticSecondaryBG xl:px-20 sm:px-20 px-5 flex-col gap-10`}>
               <div className="flex flex-col gap-4">
                  <Image src={"/Common/Logo.png"} width={250} height={250} alt="website logo" />
                  <h3 className="uppercase md:text-[20px]! text-headingColor">Review your Bag</h3>
               </div>
               <div className="flex flex-col gap-6">
                  <div className=" max-h-[80vh] overflow-y-auto overflow-x-hidden flex flex-col gap-6 pb-10!">{cartItems.length > 0 && cartItems.map((item) => <CheckoutCards product={item} quantity={item.quantity} key={item.id + item.colorVariants + item.material} />)}</div>
                  <div className="flex flex-col gap-4 ">
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]">Subtotal</p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600 }}>
                           ${subtotal.toFixed(2)}
                        </p>
                     </span>
                     <span className="flex justify-between ">
                        <p className="text-[#5E5F5F]">Shipping</p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600 }}>
                           ${shippingFee.toFixed(2)}
                        </p>
                     </span>
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]" style={{ fontFamily: "InterSemiBold", fontWeight: 600, fontSize: 16 }}>
                           Total
                        </p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600, fontSize: 16 }}>
                           ${total.toFixed(2)}
                        </p>
                     </span>
                  </div>
               </div>
               <div className=" flex">
                  <Button name={loading ? "Processing..." : "Pay Now"} mainClass="w-full" onClick={handlePlaceOrder} />
               </div>
            </div>
            <div className="lg:w-2/4 w-full bg-white 2xl:px-40 xl:px-20 sm:px-20 px-5 lg:py-18 py-5 flex-col lg:gap-10 gap-6 flex">
               <div className="flex flex-col gap-4">
                  <h4 className="text-lightText lg:hidden flex">Cart / Shipping / Payment</h4>
                  <p className="text-lightText lg:flex hidden">Cart / Shipping / Payment</p>
                  <h2 className="uppercase text-headingColor">Checkout</h2>
               </div>

               {errorMsg && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{errorMsg}</div>}
               {successMsg && <div className="p-3 bg-green-100 text-green-700 text-sm rounded">{successMsg}</div>}

               <div className="flex flex-col gap-3">
                  <h3 className="lg:text-[20px]! text-headingColor">Contact</h3>
                  <div className="flex flex-col gap-2">
                     <h4 className="text-headingColor">Phone Number</h4>
                     <input
                        type="text"
                        placeholder="Enter Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                     />
                  </div>
               </div>
               <div className="flex flex-col gap-3">
                  <h3 className="lg:text-[20px]! text-headingColor">Delivery Method</h3>
                  <div className=" gap-2 border-2 border-gray-200 flex items-center rounded-sm px-3 py-3 cursor-pointer group " onClick={() => setIsShipping(!isShipping)}>
                     <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-gray-500">
                        <div className={`${isShipping ? "w-2 h-2" : "w-0 h-0"} transition-all duration-200 rounded-full bg-BtnBlack`} />
                     </div>
                     <p className={`${isShipping ? "text-textBlack" : "text-gray-400"} transition-all duration-300 text-sm! font-normal! group-active:scale-95`}>Shipping ($15.00)</p>
                  </div>
               </div>
               <div className="flex flex-col gap-3">
                  <h3 className="lg:text-[20px]! text-headingColor">Shipping Information</h3>
                  <div className="flex flex-col gap-4.5">
                     <div className="flex items-center gap-5">
                        <div className="flex flex-col gap-2 w-full">
                           <h4 className="text-headingColor">Full name</h4>
                           <input
                              type="text"
                              placeholder="Enter full name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                           />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                           <h4 className="text-headingColor">Last name</h4>
                           <input
                              type="text"
                              placeholder="Enter last name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                           />
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <h4 className="text-headingColor">Address</h4>
                        <input
                           type="text"
                           placeholder="Enter Your Address"
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}
                           className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                        />
                     </div>
                     <div className="flex items-center gap-5">
                        <div className="flex flex-col gap-2 w-full">
                           <h4 className="text-headingColor">City</h4>
                           <input
                              type="text"
                              placeholder="Enter city"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                           />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                           <h4>State / Country</h4>
                           <input
                              type="text"
                              placeholder="Enter state"
                              value={stateVal}
                              onChange={(e) => setStateVal(e.target.value)}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                           />
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <h4 className="text-headingColor">Email address</h4>
                        <input
                           type="email"
                           placeholder="Enter email address"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                        />
                     </div>
                     <div className="flex items-center gap-2">
                        <input
                           type="checkbox"
                           checked={agreed}
                           onChange={(e) => setAgreed(e.target.checked)}
                           className="w-4 h-4 accent-BtnBlack"
                        />
                        <p className="text-textBlack">I have read and agree to the Terms and Conditions.</p>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col gap-3">
                  <h3 className="lg:text-[20px]! text-headingColor">Payment</h3>
                  <div className="flex flex-col  border border-gray-300 rounded-md overflow-hidden">
                     <div
                        className="border-b border-gray-300  py-3 cursor-pointer px-3"
                        onClick={() => setPaymentThrough("bank")}
                     >
                        <span className="flex items-center gap-2">
                           <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-gray-500">
                              <div className={`${paymentThrough === "bank" ? "w-2 h-2" : "w-0 h-0"} transition-all duration-200 rounded-full bg-BtnBlack`} />
                           </div>
                           <h4 className="text-headingColor">Online Payment / Bank</h4>
                        </span>
                     </div>
                     <div
                        className="py-3 cursor-pointer px-3"
                        onClick={() => setPaymentThrough("cash")}
                     >
                        <span className="flex items-center gap-2">
                           <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-gray-500">
                              <div className={`${paymentThrough === "cash" ? "w-2 h-2" : "w-0 h-0"} transition-all duration-200 rounded-full bg-ptica` || "w-0 h-0"} transition-all duration-200 rounded-full bg-BtnBlack`} />
                           </div>
                           <h4 className="text-headingColor">Cash On Delivery</h4>
                        </span>
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
                  {cartItems.length > 0 ? (
                     <div className=" max-h-[50vh] overflow-auto pb-10! flex flex-col gap-6">
                        {cartItems.map((item) => (
                           <CheckoutCards product={item} quantity={item.quantity} key={item.id + item.colorVariants + item.material} />
                        ))}
                     </div>
                  ) : (
                     <div className="w-100 h-30 flex items-center justify-center">
                        <h3 className="text-gray-400 ">No Product In Cart</h3>
                     </div>
                  )}
                  <div className="flex flex-col gap-4 w-100">
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]">Subtotal</p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600 }}>
                           ${subtotal.toFixed(2)}
                        </p>
                     </span>
                     <span className="flex justify-between ">
                        <p className="text-[#5E5F5F]">Shipping</p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600 }}>
                           ${shippingFee.toFixed(2)}
                        </p>
                     </span>
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]" style={{ fontFamily: "InterSemiBold", fontWeight: 600, fontSize: 16 }}>
                           Total
                        </p>
                        <p className="text-headingColor" style={{ fontFamily: "InterSemiBold", fontWeight: 600, fontSize: 16 }}>
                           ${total.toFixed(2)}
                        </p>
                     </span>
                  </div>
               </div>
               <div className="w-100 flex">
                  <Button name={loading ? "Processing..." : "Pay Now"} mainClass="w-full" onClick={handlePlaceOrder} />
               </div>
            </div>
         </div>
      </MainLayout>
   );
};

export default Checkout;
