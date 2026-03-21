import { OrderStatus } from "@/Types/Order/OrderType";

const STATUS_STYLE: Record<OrderStatus, string> = {
   Pending: "bg-amber-50 text-amber-700",
   Processing: "bg-blue-50 text-blue-700",
   Shipped: "bg-purple-50 text-purple-700",
   Delivered: "bg-green-50 text-green-700",
   Cancelled: "bg-red-50 text-red-600",
};
export function StatusBadge({ status }: { status: OrderStatus }) {
   return <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full w-fit ${STATUS_STYLE[status]}`}>{status}</span>;
}
