export type Variant = "info" | "success" | "warning" | "error";
export type NotifType = "toast" | "banner";

export interface TNotification {
   id: string;
   variant: Variant;
   type: NotifType;
   title?: string;
   message: string;
   actions?: { label: string; onClick: () => void }[];
}
