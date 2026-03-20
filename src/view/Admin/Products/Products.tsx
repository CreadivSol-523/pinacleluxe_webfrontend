import AdminLayout from "@/layout/AdminLayout";
import ProductManagement from "@/ui/Admin/ProductManagement/ProductManagement";
import React from "react";

const Products = () => {
   return (
      <AdminLayout>
         <ProductManagement />
      </AdminLayout>
   );
};

export default Products;
