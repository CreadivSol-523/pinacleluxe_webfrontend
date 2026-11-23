export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";
export type PaymentMethod = "COD" | "Online" | "PayFast" | "Stripe";

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
   paymentMethod: PaymentMethod;
   shippingPrice?: number;
}

// OrderItem used across the app (both backend responses and mock data)
export interface OrderItem {
   productId?: string;
   product?: string;
   name: string;
   productName?: string;
   image: string;
   thumbnail?: string;
   color?: string;
   material?: string;
   quantity: number;
   price: number;
}

// Order interface accommodating mock data and backend orders
export interface Order {
   id: string;
   _id?: string;
   orderNumber: string;
   customer: {
      name: string;
      email: string;
      phone: string;
   };
   address: {
      city: string;
      area: string;
      street: string;
   };
   items: OrderItem[];
   total: string | number;
   status: OrderStatus;
   createdAt: string;
   updatedAt: string;

   // Optional backend fields
   customerDetails?: CustomerDetailsInput;
   shippingAddress?: {
      fullName: string;
      address: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
      phone: string;
      email: string;
   };
   orderItems?: OrderItem[];
   itemsPrice?: number;
   subtotal?: number;
   shippingPrice?: number;
   shippingCost?: number;
   taxPrice?: number;
   tax?: number;
   totalPrice?: number;
   orderStatus?: string;
   paymentStatus?: PaymentStatus | string;
   paymentMethod?: PaymentMethod | string;
   paymentProvider?: string;
   detectedCountry?: string;
   notes?: string;
}

export interface OrdersResponse {
   success: boolean;
   pagination?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
   };
   orders?: Order[];
   data?: Order[];
}

export interface SingleOrderResponse {
   success: boolean;
   order?: Order;
   data?: Order;
   message?: string;
}
