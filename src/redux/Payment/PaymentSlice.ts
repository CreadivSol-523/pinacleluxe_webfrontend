import {
   ConfirmStripePaymentPayload,
   ConfirmStripePaymentResponse,
   CreateStripeCheckoutPayload,
   CreateStripeCheckoutResponse,
   CreateStripePaymentIntentPayload,
   CreateStripePaymentIntentResponse,
   InitializePaymentPayload,
   InitializePaymentResponse,
   InitiatePayFastPayload,
   InitiatePayFastResponse,
   LocationDetectionResult,
} from "@/Types/Payment/PaymentTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PaymentSlice = createApi({
   reducerPath: "PaymentSlice",
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
   tagTypes: ["Payment"],
   endpoints: (builder) => ({
      detectCountry: builder.query<LocationDetectionResult, void>({
         queryFn: async (_arg, _queryApi, _extraOptions, baseQuery) => {
            // 1. Try client-side direct geolocation
            try {
               const clientGeoRes = await fetch("https://api.country.is/", {
                  signal: AbortSignal.timeout(2500),
               });
               if (clientGeoRes.ok) {
                  const clientGeo = await clientGeoRes.json();
                  const countryCode = String(clientGeo.country || "").toUpperCase();
                  if (countryCode && countryCode.length === 2) {
                     return {
                        data: {
                           countryCode,
                           countryName: countryCode === "PK" ? "Pakistan" : undefined,
                           isPakistan: countryCode === "PK",
                           recommendedGateway: countryCode === "PK" ? "payfast" : "stripe",
                           detectionMethod: "client_country_is",
                        },
                     };
                  }
               }
            } catch {
               // Fallback to backend detect-country endpoint
            }

            // 2. Fallback to backend detect-country endpoint
            const result = await baseQuery({
               url: "/api/payment/detect-country",
               method: "GET",
            });

            if (result.error) {
               return {
                  data: {
                     countryCode: "PK",
                     countryName: "Pakistan",
                     isPakistan: true,
                     recommendedGateway: "payfast",
                     detectionMethod: "fallback_default",
                  },
               };
            }

            const data = result.data as any;
            return {
               data: {
                  countryCode: data.countryCode || "PK",
                  countryName: data.countryName || (data.countryCode === "PK" ? "Pakistan" : undefined),
                  isPakistan: data.isPakistan ?? (data.countryCode === "PK"),
                  recommendedGateway: data.recommendedGateway || (data.countryCode === "PK" ? "payfast" : "stripe"),
                  detectionMethod: data.detectionMethod,
               },
            };
         },
      }),

      initiatePayFast: builder.mutation<InitiatePayFastResponse, InitiatePayFastPayload>({
         query: (payload) => ({
            url: "/api/payment/payfast/initiate",
            method: "POST",
            body: payload,
         }),
      }),

      createStripeCheckout: builder.mutation<CreateStripeCheckoutResponse, CreateStripeCheckoutPayload>({
         query: (payload) => ({
            url: "/api/payment/stripe/create-checkout-session",
            method: "POST",
            body: payload,
         }),
      }),

      createStripePaymentIntent: builder.mutation<CreateStripePaymentIntentResponse, CreateStripePaymentIntentPayload>({
         query: (payload) => ({
            url: "/api/payment/stripe/create-payment-intent",
            method: "POST",
            body: payload,
         }),
      }),

      confirmStripePayment: builder.mutation<ConfirmStripePaymentResponse, ConfirmStripePaymentPayload>({
         query: (payload) => ({
            url: "/api/payment/stripe/confirm-payment",
            method: "POST",
            body: payload,
         }),
      }),

      initializePayment: builder.mutation<InitializePaymentResponse, InitializePaymentPayload>({
         query: (payload) => ({
            url: "/api/payment/initialize",
            method: "POST",
            body: payload,
         }),
      }),
   }),
});

export const {
   useDetectCountryQuery,
   useLazyDetectCountryQuery,
   useInitiatePayFastMutation,
   useCreateStripeCheckoutMutation,
   useCreateStripePaymentIntentMutation,
   useConfirmStripePaymentMutation,
   useInitializePaymentMutation,
} = PaymentSlice;

export default PaymentSlice;
