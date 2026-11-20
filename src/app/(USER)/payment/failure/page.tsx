"use client";
import MainLayout from "@/layout/MainLayout";
import { XCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PaymentFailurePage() {
   return (
      <MainLayout>
         <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-5">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
               <div className="flex justify-center mb-4">
                  <XCircle className="w-16 h-16 text-red-500" />
               </div>
               <h2 className="text-2xl font-bold text-headingColor mb-2">Payment Failed or Cancelled</h2>
               <p className="text-lightText mb-6">Your payment could not be completed. Please try again or choose another payment method.</p>
               <div className="flex flex-col gap-3">
                  <Link
                     href="/checkout"
                     className="w-full bg-BtnBlack text-white py-3 rounded-md hover:bg-opacity-90 transition-all font-medium text-center"
                  >
                     Return to Checkout
                  </Link>
                  <Link
                     href="/"
                     className="w-full border border-gray-300 text-headingColor py-3 rounded-md hover:bg-gray-50 transition-all font-medium text-center"
                  >
                     Return to Home
                  </Link>
               </div>
            </div>
         </div>
      </MainLayout>
   );
}
