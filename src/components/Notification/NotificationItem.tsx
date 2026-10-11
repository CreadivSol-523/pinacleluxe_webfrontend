"use client";
import { useEffect, useState } from "react";
import { bannerBorder, btnStyles, icons, variantStyles } from "./Icons";
import { TNotification } from "@/Types/Notification/notification.types";

interface Props {
   notif: TNotification;
   onDismiss: () => void;
}

export const NotificationItem = ({ notif, onDismiss }: Props) => {
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
   }, []);

   if (notif.type === "banner") {
      return (
         <div
            className={`
          flex items-center gap-3 px-4 py-3 border-l-[3px] rounded-r-xl
          ${variantStyles[notif.variant]} ${bannerBorder[notif.variant]}
          shadow-sm w-80 transition-all duration-300
          ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
        `}
         >
            <span className="text-sm shrink-0">{icons[notif.variant]}</span>
            <p className="text-sm font-medium flex-1">{notif.message}</p>
            <button onClick={onDismiss} className="text-lg leading-none opacity-40 hover:opacity-100 transition-opacity">
               ×
            </button>
         </div>
      );
   }

   return (
      <div
         className={`
        flex items-start gap-3 p-4 rounded-xl border
        ${variantStyles[notif.variant]}
        shadow-sm w-80 transition-all duration-300
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
      >
         <span className="mt-0.5 shrink-0">{icons[notif.variant]}</span>
         <div className="flex-1">
            {notif.title && <p className="text-sm font-medium leading-snug">{notif.title}</p>}
            <p className={`text-sm leading-relaxed ${notif.title ? "mt-1 opacity-80" : "font-medium"}`}>{notif.message}</p>
            {notif.actions && notif.actions.length > 0 && (
               <div className="flex gap-2 mt-3">
                  {notif.actions.map((action, i) => (
                     <button key={i} onClick={action.onClick} className={`text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent transition-colors ${btnStyles[notif.variant]}`}>
                        {action.label}
                     </button>
                  ))}
               </div>
            )}
         </div>
         <button onClick={onDismiss} className="text-lg leading-none opacity-40 hover:opacity-100 transition-opacity">
            ×
         </button>
      </div>
   );
};
