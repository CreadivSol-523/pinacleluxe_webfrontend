import { useNotification } from "@/context/NotificationContext";
import {
   useConfirmStripePaymentMutation,
   useCreateStripeCheckoutMutation,
   useCreateStripePaymentIntentMutation,
   useDetectCountryQuery,
   useInitializePaymentMutation,
   useInitiatePayFastMutation,
   useLazyDetectCountryQuery,
} from "@/redux/Payment/PaymentSlice";
import {
   ConfirmStripePaymentPayload,
   CreateStripeCheckoutPayload,
   CreateStripePaymentIntentPayload,
   InitializePaymentPayload,
   InitiatePayFastPayload,
} from "@/Types/Payment/PaymentTypes";

// Hook to detect user country and recommended gateway
export const useDetectCountryHandler = () => {
   const { data, isLoading, isFetching, isError, error, refetch } = useDetectCountryQuery();
   const [triggerDetectCountry, lazyResult] = useLazyDetectCountryQuery();

   return {
      location: data,
      isLoading: isLoading || isFetching,
      isError,
      error,
      refetch,
      detectCountry: triggerDetectCountry,
      lazyResult,
   } as const;
};

// Hook for PayFast initiation
export const useInitiatePayFastHandler = () => {
   const [initiatePayFastMutation, { isLoading }] = useInitiatePayFastMutation();
   const { show } = useNotification();

   const handleInitiatePayFast = async (payload: InitiatePayFastPayload) => {
      try {
         const res = await initiatePayFastMutation(payload).unwrap();
         return {
            success: true,
            data: res,
         };
      } catch (error: any) {
         const msg = error?.data?.message || error?.message || "Failed to initiate PayFast payment";
         show({
            type: "banner",
            variant: "error",
            message: msg,
         });
         return {
            success: false,
            message: msg,
         };
      }
   };

   return {
      handleInitiatePayFast,
      isLoading,
   };
};

// Hook for Stripe Payment Intent creation (used with Stripe Elements)
export const useCreateStripePaymentIntentHandler = () => {
   const [createPaymentIntentMutation, { isLoading }] = useCreateStripePaymentIntentMutation();
   const { show } = useNotification();

   const handleCreatePaymentIntent = async (payload: CreateStripePaymentIntentPayload) => {
      try {
         const res = await createPaymentIntentMutation(payload).unwrap();
         return {
            success: true,
            data: res,
         };
      } catch (error: any) {
         const msg = error?.data?.message || error?.message || "Failed to create Stripe payment intent";
         show({
            type: "banner",
            variant: "error",
            message: msg,
         });
         return {
            success: false,
            message: msg,
         };
      }
   };

   return {
      handleCreatePaymentIntent,
      isLoading,
   };
};

// Hook to confirm Stripe payment on backend
export const useConfirmStripePaymentHandler = () => {
   const [confirmPaymentMutation, { isLoading }] = useConfirmStripePaymentMutation();
   const { show } = useNotification();

   const handleConfirmPayment = async (payload: ConfirmStripePaymentPayload) => {
      try {
         const res = await confirmPaymentMutation(payload).unwrap();
         return {
            success: true,
            data: res,
         };
      } catch (error: any) {
         const msg = error?.data?.message || error?.message || "Failed to confirm payment on backend";
         show({
            type: "banner",
            variant: "error",
            message: msg,
         });
         return {
            success: false,
            message: msg,
         };
      }
   };

   return {
      handleConfirmPayment,
      isLoading,
   };
};

// Hook to create Stripe Checkout session (hosted redirection)
export const useCreateStripeCheckoutHandler = () => {
   const [createCheckoutMutation, { isLoading }] = useCreateStripeCheckoutMutation();
   const { show } = useNotification();

   const handleCreateCheckout = async (payload: CreateStripeCheckoutPayload) => {
      try {
         const res = await createCheckoutMutation(payload).unwrap();
         return {
            success: true,
            data: res,
         };
      } catch (error: any) {
         const msg = error?.data?.message || error?.message || "Failed to create Stripe checkout session";
         show({
            type: "banner",
            variant: "error",
            message: msg,
         });
         return {
            success: false,
            message: msg,
         };
      }
   };

   return {
      handleCreateCheckout,
      isLoading,
   };
};

// Hook for unified payment initialization
export const useInitializePaymentHandler = () => {
   const [initializePaymentMutation, { isLoading }] = useInitializePaymentMutation();
   const { show } = useNotification();

   const handleInitializePayment = async (payload: InitializePaymentPayload) => {
      try {
         const res = await initializePaymentMutation(payload).unwrap();
         return {
            success: true,
            data: res,
         };
      } catch (error: any) {
         const msg = error?.data?.message || error?.message || "Failed to initialize payment";
         show({
            type: "banner",
            variant: "error",
            message: msg,
         });
         return {
            success: false,
            message: msg,
         };
      }
   };

   return {
      handleInitializePayment,
      isLoading,
   };
};
