import BaseAPI from "./api";

// Types
export interface CreateOrderPayload {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    variant?: {
      material?: string;
      color?: {
        hex?: string;
        colorName?: string;
      };
    };
    thumbnail?: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes?: string;
  region?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data?: {
    orderId: string;
    orderNumber: string;
    total: number;
    status: string;
  };
  insufficientStock?: Array<{
    productId: string;
    productName: string;
    requested: number;
    available: number;
  }>;
}

// API Functions
class OrderAPI extends BaseAPI {

  static async createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
    return this.request<OrderResponse>("/order/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async getOrderById(orderId: string): Promise<any> {
    return this.request(`/order/${orderId}`, {
      method: "GET",
    });
  }

  static async getUserOrders(userId: string, page = 1, limit = 10): Promise<any> {
    return this.request(`/order/user/${userId}?page=${page}&limit=${limit}`, {
      method: "GET",
    });
  }
}

export default OrderAPI;
