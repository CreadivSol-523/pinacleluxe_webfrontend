import { Order } from "../Order/OrderType";

export interface Customer {
   id: string;
   name: string;
   email: string;
   phone: string;
   city: string;
   joinedAt: string; // ISO
   totalOrders: number;
   totalSpent: number;
   orders: Order[];
}
