"use client";
import Button from "@/components/Button/Button";
import CheckoutCards from "@/components/Cards/CheckoutCards/CheckoutCards";
import MainLayout from "@/layout/MainLayout";
import { useCartStore } from "@/Storage/UseCartStore";
import { ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useCreateOrderHandler } from "@/modals/OrderModal";
import { useConfirmStripePaymentHandler, useDetectCountryHandler, useInitializePaymentHandler } from "@/modals/PaymentModal";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "@/components/Payment/StripePaymentForm";

// Initialize Stripe Promise
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51SN0Oz7BKNcaqcoUYc8L8mO8Kx6U91w1bQO9u64m0Qx4M8N3xU7vP8y7R7k1T2v0X4a5b6c7d8e9f0");

const Checkout = () => {
   const [mobileCheckout, setMobileCheckout] = useState<Boolean>(false);
   const [isShipping, setIsShipping] = useState<Boolean>(true);
   const [paymentThrough, setPaymentThrough] = useState<"payfast" | "stripe" | "cod">("payfast");

   // Form states
   const [phoneNumber, setPhoneNumber] = useState("");
   const [fullName, setFullName] = useState("");
   const [lastName, setLastName] = useState("");
   const [address, setAddress] = useState("");
   const [city, setCity] = useState("");
   const [stateVal, setStateVal] = useState("Pakistan");
   const [email, setEmail] = useState("");
   const [agreed, setAgreed] = useState(false);
   const [loading, setLoading] = useState(false);
   const [errorMsg, setErrorMsg] = useState("");
   const [successMsg, setSuccessMsg] = useState("");

   // Stripe Elements state
   const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
   const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

   // Redux Hooks via modals
   const { location: detectedLocation } = useDetectCountryHandler();
   const { handleCreateOrder, isLoading: isCreatingOrder } = useCreateOrderHandler();
   const { handleInitializePayment, isLoading: isInitializingPayment } = useInitializePaymentHandler();
   const { handleConfirmPayment } = useConfirmStripePaymentHandler();

   const cartItems = useCartStore((state) => state.items);
   const clearCart = useCartStore((state) => state.clearCart);
   console.log(cartItems);
   const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 45) * item.quantity, 0);
   const shippingFee = 15;
   const total = subtotal + shippingFee;

   // Sync detected country from Redux Payment query
   useEffect(() => {
      if (detectedLocation) {
         if (detectedLocation.isPakistan) {
            setStateVal("Pakistan");
            setPaymentThrough("payfast");
         } else {
            const countryLabel = detectedLocation.countryName || detectedLocation.countryCode || "United States";
            setStateVal(countryLabel);
            setPaymentThrough("stripe");
         }
      }
   }, [detectedLocation]);

   const isPakistan = stateVal.trim().toLowerCase() === "pakistan" || stateVal.trim().toLowerCase() === "pk";

   const handleStripeSuccess = async (orderId: string) => {
      try {
         setSuccessMsg("Payment successful! Finalizing your order...");
         await handleConfirmPayment({ orderId, paymentIntentId: "" });
         clearCart();
         setTimeout(() => {
            window.location.href = `/order-confirmation/${orderId}?payment=success`;
         }, 1000);
      } catch (e) {
         clearCart();
         window.location.href = `/order-confirmation/${orderId}?payment=success`;
      }
   };

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

      // Purane items (jo regionId ke baghair cart mein save the) ko pehle pakdo
      const missingRegion = cartItems.find((item: any) => !item.regionId);
      if (missingRegion) {
         setErrorMsg(`Please remove "${missingRegion.name}" from your cart and add it again.`);
         return;
      }

      setLoading(true);
      try {
         // Price client se nahi bhejte: server material + region se khud nikalta hai
         const orderItems = cartItems.map((item: any) => ({
            product: item.id || item._id,
            name: item.name || "Luxury Item",
            quantity: Number(item.quantity) || 1,
            material: item.material || "",
            colorVariants: item.colorVariants || "",
            region: item.regionId,
            image: typeof item.images === "string" ? item.images : item.images?.[0] || item.image || "",
         }));

         const payload = {
            customerDetails: {
               fullName: `${fullName} ${lastName}`.trim(),
               email: email || "customer@pinacleluxe.com",
               phone: phoneNumber,
               address,
               city,
               postalCode: "10001",
               country: stateVal || "Pakistan",
            },
            orderItems,
            paymentMethod: (paymentThrough === "cod" ? "COD" : "Online") as "COD" | "Online" | "PayFast" | "Stripe",
            shippingPrice: shippingFee,
         };

         // 1. Create order in backend via Redux OrderModal
         const orderResponse = await handleCreateOrder(payload);
         if (!orderResponse.success || !orderResponse.data) {
            throw new Error(orderResponse.message || "Failed to create order.");
         }
         const orderId = (orderResponse.data as any)._id;

         if (!orderId) {
            throw new Error("Order created but order ID is missing.");
         }

         setCreatedOrderId(orderId);

         // 2. Handle Payment Gateways (Centralized backend provider selection via Redux)
         if (paymentThrough === "cod") {
            setSuccessMsg("Order placed successfully!");
            clearCart();
            setTimeout(() => {
               window.location.href = `/order-confirmation/${orderId}`;
            }, 1500);
            return;
         }

         setSuccessMsg("Initializing secure payment...");
         const paymentResWrapper = await handleInitializePayment({ orderId, userMobileNumber: phoneNumber });
         if (!paymentResWrapper.success || !paymentResWrapper.data) {
            throw new Error(paymentResWrapper.message || "Failed to initialize payment");
         }
         const paymentRes = paymentResWrapper.data;

         if (paymentRes.provider === "PayFast") {
            const formAction = paymentRes.formPostURL;
            const formData = paymentRes.formFields;

            if (formAction && formData) {
               const form = document.createElement("form");
               form.method = "POST";
               form.action = formAction;

               Object.keys(formData).forEach((key) => {
                  const input = document.createElement("input");
                  input.type = "hidden";
                  input.name = key;
                  input.value = formData[key];
                  form.appendChild(input);
               });

               document.body.appendChild(form);
               form.submit();
               return;
            } else {
               throw new Error(paymentRes.message || "Failed to initialize PayFast");
            }
         } else if (paymentRes.provider === "Stripe") {
            // STRIPE ELEMENTS FLOW
            if (paymentRes.clientSecret) {
               setStripeClientSecret(paymentRes.clientSecret);
               setSuccessMsg("");
               return;
            } else {
               throw new Error(paymentRes.message || "Failed to initialize Stripe payment");
            }
         } else {
            throw new Error("Unknown payment provider returned by server");
         }
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
                        <p className="text-headingColor">${subtotal.toFixed(2)}</p>
                     </span>
                     <span className="flex justify-between ">
                        <p className="text-[#5E5F5F]">Shipping</p>
                        <p className="text-headingColor">${shippingFee.toFixed(2)}</p>
                     </span>
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]" style={{ fontWeight: 800, fontSize: 16 }}>
                           Total
                        </p>
                        <p className="text-headingColor" style={{ fontWeight: 800, fontSize: 16 }}>
                           ${total.toFixed(2)}
                        </p>
                     </span>
                  </div>
               </div>
               <div className=" flex">
                  {stripeClientSecret && paymentThrough === "stripe" ? <p className="text-sm text-gray-500 italic text-center w-full">Please complete payment using the card form below.</p> : <Button name={loading ? "Processing..." : "Pay Now"} mainClass="w-full" onClick={handlePlaceOrder} />}
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
                     <input type="text" placeholder="Enter Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
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
                           <input type="text" placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                           <h4 className="text-headingColor">Last name</h4>
                           <input type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <h4 className="text-headingColor">Address</h4>
                        <input type="text" placeholder="Enter Your Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                     </div>
                     <div className="flex items-center gap-5">
                        <div className="flex flex-col gap-2 w-full">
                           <h4 className="text-headingColor">City</h4>
                           <input type="text" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                           <h4 className="text-headingColor">Country</h4>
                           <select
                              value={stateVal}
                              onChange={(e) => {
                                 const val = e.target.value;
                                 setStateVal(val);
                                 // Auto select gateway based on country
                                 if (!val) return;
                                 setPaymentThrough(val === "Pakistan" ? "payfast" : "stripe");
                              }}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-black cursor-pointer"
                           >
                              <option value="">Select country</option>
                              <option value="Pakistan">Pakistan (PK)</option>
                              <option value="United Kingdom">United Kingdom (UK)</option>
                           </select>
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <h4 className="text-headingColor">Email address</h4>
                        <input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                     </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 accent-BtnBlack" />
                        <p className="text-textBlack">I have read and agree to the Terms and Conditions.</p>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col gap-3">
                  <h3 className="lg:text-[20px]! text-headingColor">Payment Method</h3>
                  <div className="flex flex-col border border-gray-300 rounded-md overflow-hidden">
                     <div className="border-b border-gray-300 py-3 cursor-pointer px-3 bg-gray-50" onClick={() => setPaymentThrough(isPakistan ? "payfast" : "stripe")}>
                        <span className="flex items-center gap-2">
                           <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-gray-500">
                              <div className={`${paymentThrough !== "cod" ? "w-2 h-2" : "w-0 h-0"} transition-all duration-200 rounded-full bg-BtnBlack`} />
                           </div>
                           <h4 className="text-headingColor font-semibold">Credit / Debit Card</h4>
                        </span>
                     </div>
                     <div
                        className="py-3 cursor-pointer px-3"
                        onClick={() => {
                           setPaymentThrough("cod");
                           setStripeClientSecret(null);
                        }}
                     >
                        <span className="flex items-center gap-2">
                           <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-gray-500">
                              <div className={`${paymentThrough === "cod" ? "w-2 h-2" : "w-0 h-0"} transition-all duration-200 rounded-full bg-BtnBlack`} />
                           </div>
                           <h4 className="text-headingColor">Cash On Delivery</h4>
                        </span>
                     </div>
                  </div>

                  {/* Embedded Stripe Elements Form */}
                  {stripeClientSecret && paymentThrough === "stripe" && createdOrderId && (
                     <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm flex flex-col gap-3 mt-2">
                        <h4 className="font-semibold text-headingColor">Enter Card Details</h4>
                        <Elements
                           stripe={stripePromise}
                           options={{
                              clientSecret: stripeClientSecret,
                              appearance: {
                                 theme: "stripe",
                                 variables: {
                                    colorPrimary: "#141414",
                                 },
                              },
                           }}
                        >
                           <StripePaymentForm orderId={createdOrderId} amount={total} onSuccess={handleStripeSuccess} onError={(msg) => setErrorMsg(msg)} />
                        </Elements>
                     </div>
                  )}
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
                        <p className="text-headingColor">${subtotal.toFixed(2)}</p>
                     </span>
                     <span className="flex justify-between ">
                        <p className="text-[#5E5F5F]">Shipping</p>
                        <p className="text-headingColor">${shippingFee.toFixed(2)}</p>
                     </span>
                     <span className="flex justify-between">
                        <p className="text-[#5E5F5F]" style={{ fontWeight: 800, fontSize: 16 }}>
                           Total
                        </p>
                        <p className="text-headingColor" style={{ fontWeight: 800, fontSize: 16 }}>
                           ${total.toFixed(2)}
                        </p>
                     </span>
                  </div>
               </div>
               <div className="w-100 flex">
                  {stripeClientSecret && paymentThrough === "stripe" ? <p className="text-sm text-gray-500 italic text-center w-full">Please complete payment using the card form above.</p> : <Button name={loading ? "Processing..." : "Pay Now"} mainClass="w-full" onClick={handlePlaceOrder} />}
               </div>
            </div>
         </div>
      </MainLayout>
   );
};

export default Checkout;
