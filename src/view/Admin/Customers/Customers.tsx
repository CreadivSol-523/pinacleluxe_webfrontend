import AdminLayout from "@/layout/AdminLayout";
import CustomerPage from "@/ui/Admin/Customer/CustomerPage";
import React from "react";

const Customers = () => {
   return (
      <AdminLayout>
         <CustomerPage />
      </AdminLayout>
   );
};

export default Customers;
