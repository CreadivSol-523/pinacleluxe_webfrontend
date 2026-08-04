import { useCartStore } from "@/Storage/UseCartStore";
import { Cart } from "@/Types/Cart/CartTypes";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useEffectEvent, useState } from "react";

const SidebarCard = ({ product, quantity }: Cart) => {
   const [updateQuantityState, setUpdateQuantityState] = useState<number>(quantity);

   console.log(product);

   const { updateQuantity, removeFromCart } = useCartStore();

   const GetCartSingleItem = useCartStore((state) => state.items.find((item) => item.id === product?.id && item?.colorVariants === product.colorVariants && item.material === product.material));

   const GetQuantitySelected = useEffectEvent(() => {
      setUpdateQuantityState(GetCartSingleItem?.quantity || 1);
   });

   useEffect(() => {
      GetQuantitySelected();
   }, [GetCartSingleItem]);

   const handleIncreaseQuantity = () => {
      const updateProductQuantity = updateQuantityState < product.stock ? updateQuantityState + 1 : updateQuantityState;
      setUpdateQuantityState(updateProductQuantity);
      updateQuantity(product.id, updateProductQuantity, product?.colorVariants, product.material);
   };

   const handleDecreaseQuantity = () => {
      const updateProductQuantity = updateQuantityState <= 1 ? 1 : updateQuantityState - 1;
      setUpdateQuantityState(updateProductQuantity);
      updateQuantity(product.id, updateProductQuantity, product?.colorVariants, product.material);
   };

   return (
      <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
         {/* Product Image */}
         <div className="shrink-0  border border-gray-200 bg-gray-50">
            <Image src="/Dummy/Product/ProductImg2.png" alt={product.name || "product image"} width={130} height={130} className="h-37.5 w-32.5 object-cover" />
         </div>

         {/* Details */}
         <div className="flex flex-col justify-between flex-1 h-32.5 py-1">
            <div className="flex flex-col gap-2">
               <p className="text-[18px]! font-medium text-gray-900 leading-tight line-clamp-1">{product.name || "Easy Zipper Tote"}</p>

               <p className="text-[13px] text-gray-500" style={{ fontFamily: "InterRegular" }}>
                  Material: {product.material}
               </p>

               {/* Price - light, secondary tone */}
               <p className="text-[13px] text-gray-400 font-normal" style={{ fontFamily: "InterRegular" }}>
                  Rs {(product.price * (updateQuantityState ?? 0)).toFixed(2) || "65.00"}
               </p>
            </div>

            {/* Quantity + Remove */}
            <div className="flex items-center justify-between sm:w-50 w-40 mt-2">
               <div className="flex items-center gap-4 px-4 py-1.5 border border-gray-300 rounded-full w-fit">
                  <button type="button" onClick={handleDecreaseQuantity} className="text-gray-500 hover:text-gray-900 transition-colors">
                     <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[13px] w-4 text-center">{updateQuantityState}</span>
                  <button type="button" onClick={handleIncreaseQuantity} className="text-gray-500 hover:text-gray-900 transition-colors">
                     <Plus className="w-3.5 h-3.5" />
                  </button>
               </div>

               <button type="button" onClick={() => removeFromCart(product.id, product?.colorVariants, product.material)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default SidebarCard;
