export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
   productId: string;
   name: string;
   image: string;
   color: string; // hex
   material: string;
   quantity: number;
   price: number;
}

export interface Order {
   id: string;
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
   createdAt: string; // ISO string
   updatedAt: string;
}
