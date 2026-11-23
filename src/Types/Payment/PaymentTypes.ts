export type RecommendedGateway = "payfast" | "stripe";

export interface LocationDetectionResult {
   countryCode: string;
   countryName?: string;
   isPakistan: boolean;
   recommendedGateway: RecommendedGateway;
   detectionMethod?: string;
}

export interface InitiatePayFastPayload {
   orderId: string;
   userMobileNumber?: string;
}

export interface InitiatePayFastResponse {
   success: boolean;
   message?: string;
   formPostURL?: string;
   formFields?: Record<string, string>;
   paymentUrl?: string;
   transactionId?: string;
}

export interface CreateStripeCheckoutPayload {
   orderId: string;
}

export interface CreateStripeCheckoutResponse {
   success: boolean;
   message?: string;
   url?: string;
   id?: string;
}

export interface CreateStripePaymentIntentPayload {
   orderId: string;
}

export interface CreateStripePaymentIntentResponse {
   success: boolean;
   clientSecret?: string;
   paymentIntentId?: string;
   publishableKey?: string;
   message?: string;
}

export interface ConfirmStripePaymentPayload {
   orderId: string;
   paymentIntentId: string;
}

export interface ConfirmStripePaymentResponse {
   success: boolean;
   message?: string;
   order?: any;
}

export interface InitializePaymentPayload {
   orderId: string;
   userMobileNumber?: string;
}

export interface InitializePaymentResponse {
   success: boolean;
   provider?: RecommendedGateway | string;
   clientSecret?: string;
   publishableKey?: string;
   formPostURL?: string;
   formFields?: Record<string, string>;
   paymentUrl?: string;
   message?: string;
}
