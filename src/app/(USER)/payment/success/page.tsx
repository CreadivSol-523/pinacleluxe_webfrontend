"use client";
import MainLayout from "@/layout/MainLayout";
import { CheckCircle, Package, Truck, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

const PaymentSuccessContent = () => {
   const searchParams = useSearchParams();
   const sessionId = searchParams.get("session_id");
   const basketId = searchParams.get("basket_id");
   const errCode = searchParams.get("err_code");

   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
   const [message, setMessage] = useState("Verifying payment...");

   useEffect(() => {
      if (sessionId) {
         // Stripe success
         setStatus("success");
         setMessage("Stripe payment verified successfully!");
         localStorage.removeItem("cart-storage");
      } else if (basketId) {
         // PayFast success
         if (errCode === "000" || errCode === "00") {
            setStatus("success");
            setMessage("PayFast payment verified successfully!");
            localStorage.removeItem("cart-storage");
         } else {
            setStatus("error");
            setMessage(`Payment failed with error code: ${errCode}`);
         }
      } else {
         setStatus("success");
         setMessage("Order processed successfully!");
         localStorage.removeItem("cart-storage");
      }
   }, [sessionId, basketId, errCode]);

   return (
      <MainLayout>
         <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-5">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
               {status === "loading" && (
                  <div className="flex flex-col items-center">
                     <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-BtnBlack mb-4"></div>
                     <h2 className="text-xl font-semibold text-headingColor">Verifying Payment...</h2>
                     <p className="text-lightText mt-2">{message}</p>
                  </div>
               )}

               {status === "success" && (
                  <div className="flex flex-col items-center">
                     <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                     <h2 className="text-2xl font-bold text-headingColor mb-2">Payment Successful!</h2>
                     <p className="text-lightText mb-6">{message}</p>
                     <Link
                        href="/"
                        className="w-full bg-BtnBlack text-white py-3 rounded-md hover:bg-opacity-90 transition-all font-medium"
                     >
                        Continue Shopping
                     </Link>
                  </div>
               )}

               {status === "error" && (
                  <div className="flex flex-col items-center">
                     <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                     <h2 className="text-2xl font-bold text-headingColor mb-2">Payment Failed</h2>
                     <p className="text-lightText mb-6">{message}</p>
                     <Link
                        href="/checkout"
                        className="w-full bg-BtnBlack text-white py-3 rounded-md hover:bg-opacity-90 transition-all font-medium"
                     >
                        Try Again
                     </Link>
                  </div>
               )}
            </div>
         </div>
      </MainLayout>
   );
};

export default function PaymentSuccessPage() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <PaymentSuccessContent />
      </Suspense>
   );
}
