"use client";

import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "@/components/Button/Button";

interface StripePaymentFormProps {
   orderId: string;
   amount: number;
   onSuccess: (orderId: string) => void;
   onError: (errorMessage: string) => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
   orderId,
   amount,
   onSuccess,
   onError,
}) => {
   const stripe = useStripe();
   const elements = useElements();
   const [isProcessing, setIsProcessing] = useState(false);
   const [paymentError, setPaymentError] = useState("");

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!stripe || !elements) {
         return;
      }

      setIsProcessing(true);
      setPaymentError("");

      try {
         const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
            confirmParams: {
               return_url: `${window.location.origin}/order-confirmation/${orderId}?payment=success`,
            },
         });

         if (error) {
            const msg = error.message || "An error occurred with your payment.";
            setPaymentError(msg);
            onError(msg);
            setIsProcessing(false);
            return;
         }

         if (paymentIntent && paymentIntent.status === "succeeded") {
            onSuccess(orderId);
         } else {
            // In case of 3DS redirect or pending
            window.location.href = `/order-confirmation/${orderId}?payment=success`;
         }
      } catch (err: any) {
         const msg = err.message || "An unexpected error occurred.";
         setPaymentError(msg);
         onError(msg);
      } finally {
         setIsProcessing(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
         <PaymentElement options={{ layout: "tabs" }} />
         {paymentError && (
            <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{paymentError}</div>
         )}
         <Button
            name={isProcessing ? "Processing Payment..." : `Pay $${amount.toFixed(2)}`}
            mainClass="w-full"
            type="submit"
            disabled={!stripe || isProcessing}
         />
      </form>
   );
};

export default StripePaymentForm;
