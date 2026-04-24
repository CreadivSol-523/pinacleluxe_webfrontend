"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { NotificationItem } from "@/components/Notification/NotificationItem";
import { TNotification } from "@/Types/Notification/notification.types";

interface NotificationContextType {
   show: (notif: Omit<TNotification, "id">) => void;
   dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
   const ctx = useContext(NotificationContext);
   if (!ctx) throw new Error("useNotification must be used inside NotificationProvider");
   return ctx;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
   const [notifications, setNotifications] = useState<TNotification[]>([]);

   const dismiss = useCallback((id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
   }, []);

   const show = useCallback(
      (notif: Omit<TNotification, "id">) => {
         const id = Math.random().toString(36).slice(2);
         setNotifications((prev) => [...prev, { ...notif, id }]);
         setTimeout(() => dismiss(id), 4000);
      },
      [dismiss],
   );

   return (
      <NotificationContext.Provider value={{ show, dismiss }}>
         {children}
         <div className="fixed top-5 right-5 z-9999 flex flex-col gap-3">
            {notifications.map((notif) => (
               <NotificationItem key={notif.id} notif={notif} onDismiss={() => dismiss(notif.id)} />
            ))}
         </div>
      </NotificationContext.Provider>
   );
};
