import { useCartStore } from "@/Storage/UseCartStore";
import { Cart } from "@/Types/Cart/CartTypes";
import { Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useEffectEvent, useState } from "react";

const CheckoutCards = ({ product, quantity }: Cart) => {
   const [updateQuantityState, setUpdateQuantityState] = useState(quantity);

   const { updateQuantity, removeFromCart } = useCartStore();

   // FIX: currency bhi match karo (store bhi currency match karta hai)
   const GetCartSingleItem = useCartStore((state) => state.items.find((item) => item.id === product?.id && item.colorVariants === product.colorVariants && item.material === product.material && item.currency === product.currency));

   const GetQuantitySelected = useEffectEvent(() => {
      setUpdateQuantityState(GetCartSingleItem?.quantity || 1);
   });

   useEffect(() => {
      GetQuantitySelected();
   }, [GetCartSingleItem]);

   // FIX: currency pass karo + cart item ki quantity ko base banao
   const handleIncreaseQuantity = () => {
      const currentQty = GetCartSingleItem?.quantity ?? updateQuantityState;
      const updateProductQuantity = currentQty < product.stock ? currentQty + 1 : currentQty;
      setUpdateQuantityState(updateProductQuantity);
      updateQuantity(product.id, updateProductQuantity, product.colorVariants, product.material, product.currency);
   };

   const handleDecreaseQuantity = () => {
      const currentQty = GetCartSingleItem?.quantity ?? updateQuantityState;
      const updateProductQuantity = currentQty <= 1 ? 1 : currentQty - 1;
      setUpdateQuantityState(updateProductQuantity);
      updateQuantity(product.id, updateProductQuantity, product.colorVariants, product.material, product.currency);
   };

   const imageSrc = typeof product?.images === "string" && (product.images.startsWith("http://") || product.images.startsWith("https://") || product.images.startsWith("/")) ? product.images : "/Dummy/Product/ProductImg.png";

   return (
      <div className="flex items-center gap-6 ">
         <Image unoptimized src={imageSrc} alt={product.name || "checkout product image"} width={90} height={150} />
         <div className="flex flex-col justify-between  gap-2.5 w-full">
            <p className="text-headingColor">{product.name || "Easy Zipper Tote"}</p>
            <p className="text-lg! text-headingColor">
               {product.currency || "Rs"} {product.price * updateQuantityState || "65.00"}
            </p>
            <div className="flex items-center justify-between sm:w-60 w-full">
               <div className="flex items-center gap-3 px-4 py-1 border border-gray-400 rounded-full w-fit">
                  <Minus className="w-4 h-4 cursor-pointer" onClick={handleDecreaseQuantity} />
                  <p>{updateQuantityState}</p>
                  <Plus className="w-4 h-4 cursor-pointer" onClick={handleIncreaseQuantity} />
               </div>
               <Trash className="text-lightText cursor-pointer" onClick={() => removeFromCart(product.id, product.colorVariants, product.material, product.currency)} />
            </div>
         </div>
      </div>
   );
};

export default CheckoutCards;
