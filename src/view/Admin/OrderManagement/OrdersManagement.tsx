import AdminLayout from "@/layout/AdminLayout";
import OrderManagement from "@/ui/Admin/OrderManagement/OrderManagement";
import React from "react";

const OrdersManagement = () => {
   return (
      <AdminLayout>
         <OrderManagement />
      </AdminLayout>
   );
};

export default OrdersManagement;
