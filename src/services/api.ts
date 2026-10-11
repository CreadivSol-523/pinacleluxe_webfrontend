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
    paymentMethod: "COD" | "Online";
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
