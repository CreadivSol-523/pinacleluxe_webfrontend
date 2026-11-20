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
