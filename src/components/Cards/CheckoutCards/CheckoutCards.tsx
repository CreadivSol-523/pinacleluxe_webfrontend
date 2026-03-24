import { useCartStore } from "@/Storage/UseCartStore";
import { Cart } from "@/Types/Cart/CartTypes";
import { Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useEffectEvent, useState } from "react";

const CheckoutCards = ({ product, quantity }: Cart) => {
   const [updateQuantityState, setUpdateQuantityState] = useState(quantity);

   const { updateQuantity, removeFromCart } = useCartStore();

   const GetCartSingleItem = useCartStore((state) => state.items.find((item) => item.id === product?.id && item.colorVariants === product.colorVariants && item.material === product.material));

   const GetQuantitySelected = useEffectEvent(() => {
      setUpdateQuantityState(GetCartSingleItem?.quantity || 1);
   });

   useEffect(() => {
      GetQuantitySelected();
   }, [GetCartSingleItem]);

   const handleIncreaseQuantity = () => {
      const updateProductQuantity = updateQuantityState < product.stock ? updateQuantityState + 1 : updateQuantityState;
      setUpdateQuantityState(updateProductQuantity);
      updateQuantity(product.id, updateProductQuantity, product.colorVariants, product.material);
   };

   const handleDecreaseQuantity = () => {
      const updateProductQuantity = updateQuantityState <= 1 ? 1 : updateQuantityState - 1;
      setUpdateQuantityState(updateProductQuantity);
      updateQuantity(product.id, updateProductQuantity, product.colorVariants, product.material);
   };
   return (
      <div className="flex items-center gap-6 ">
         <Image src="/Dummy/Product/ProductImg.png" alt="sidebar card" width={90} height={150} />
         <div className="flex flex-col justify-between  gap-2.5 w-full">
            <p className="text-headingColor">{product.name || "Easy Zipper Tote"}</p>
            <p style={{ fontFamily: "InterMedium", fontWeight: 500 }} className="text-lg! text-headingColor">
               Rs {product.price * updateQuantityState || "65.00"}
            </p>
            <div className="flex items-center justify-between sm:w-60 w-full">
               <div className="flex items-center gap-3 px-4 py-1 border border-gray-400 rounded-full w-fit">
                  <Minus className="w-4 h-4 cursor-pointer" onClick={handleDecreaseQuantity} />
                  <p>{updateQuantityState}</p>
                  <Plus className="w-4 h-4 cursor-pointer" onClick={handleIncreaseQuantity} />
               </div>
               <Trash className="text-lightText cursor-pointer" onClick={() => removeFromCart(product.id, product.colorVariants, product.material)} />
            </div>
         </div>
      </div>
   );
};

export default CheckoutCards;
