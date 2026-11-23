const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface OrderItemInput {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface CustomerDetailsInput {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface CreateOrderPayload {
    customerDetails: CustomerDetailsInput;
    orderItems: OrderItemInput[];
    paymentMethod: "COD" | "Online" | "PayFast" | "Stripe";
    shippingPrice?: number;
}

export const createOrderApi = async (payload: CreateOrderPayload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to place order");
        }
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Network error while placing order");
    }
};

export const initiatePayFastPayment = async (payload: { orderId: string; userMobileNumber?: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/payfast/initiate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to initiate PayFast payment");
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Network error during PayFast initiation");
    }
};

export const createStripeCheckout = async (payload: { orderId: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/stripe/create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to create Stripe checkout session");
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Network error during Stripe checkout creation");
    }
};

export const initializePaymentApi = async (payload: { orderId: string; userMobileNumber?: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/initialize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to initialize payment");
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Network error during payment initialization");
    }
};

export const createStripePaymentIntent = async (payload: { orderId: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/stripe/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to create Stripe payment intent");
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Network error during payment initialization");
    }
};

export const confirmStripePaymentApi = async (payload: { orderId: string; paymentIntentId: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/stripe/confirm-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to confirm payment on backend");
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Network error during payment confirmation");
    }
};

export interface LocationDetectionResult {
    countryCode: string;
    countryName?: string;
    isPakistan: boolean;
    recommendedGateway: "payfast" | "stripe";
}

export const detectLocationApi = async (): Promise<LocationDetectionResult> => {
    // 1. First try client-side IP lookup direct from browser
    try {
        const clientRes = await fetch("https://api.country.is/", { cache: "no-store" });
        if (clientRes.ok) {
            const data = await clientRes.json();
            const code = (data.country || "").toUpperCase();
            if (code) {
                const isPakistan = code === "PK";
                return {
                    countryCode: code,
                    isPakistan,
                    recommendedGateway: isPakistan ? "payfast" : "stripe",
                };
            }
        }
    } catch (e) {
        // Continue to backend or fallback
    }

    try {
        const clientRes2 = await fetch("https://ipwho.is/", { cache: "no-store" });
        if (clientRes2.ok) {
            const data = await clientRes2.json();
            const code = (data.country_code || "").toUpperCase();
            if (code) {
                const isPakistan = code === "PK";
                return {
                    countryCode: code,
                    countryName: data.country,
                    isPakistan,
                    recommendedGateway: isPakistan ? "payfast" : "stripe",
                };
            }
        }
    } catch (e) {
        // Continue to backend
    }

    // 2. Fallback to backend detect endpoint
    try {
        const res = await fetch(`${API_BASE_URL}/payment/location`, { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            return {
                countryCode: data.countryCode || "PK",
                countryName: data.countryName,
                isPakistan: data.isPakistan ?? true,
                recommendedGateway: data.recommendedGateway || "payfast",
            };
        }
    } catch (e) {
        // Fallback default
    }

    return {
        countryCode: "PK",
        countryName: "Pakistan",
        isPakistan: true,
        recommendedGateway: "payfast",
    };
};

export const fetchProductsApi = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/product`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch products");
        return data.products;
    } catch (error) {
        return [];
    }
};

export interface ApiError {
    message: string;
    status?: number;
    data?: any;
}

class BaseAPI {
    protected static baseUrl = API_BASE_URL;

    protected static async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(options.headers as Record<string, string>),
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const error: ApiError = {
                message: data?.message || response.statusText || "Something went wrong",
                status: response.status,
                data,
            };
            throw error;
        }

        return data as T;
    }

    protected static async requestWithFormData<T = any>(
        endpoint: string,
        formData: FormData,
        method: "POST" | "PUT" | "PATCH" = "POST"
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

        const response = await fetch(url, {
            method,
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const error: ApiError = {
                message: data?.message || response.statusText || "Something went wrong",
                status: response.status,
                data,
            };
            throw error;
        }

        return data as T;
    }
}

export default BaseAPI;
