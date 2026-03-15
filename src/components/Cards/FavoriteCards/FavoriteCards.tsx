import Button from "@/components/Button/Button";
import { Cart } from "@/Types/Cart/CartTypes";
import { Trash } from "lucide-react";
import Image from "next/image";
import React from "react";

const FavoriteCards = ({ product }: Cart) => {
   return (
      <div className="flex items-center gap-3 ">
         <Image src="/Dummy/Product/ProductImg2.png" alt="sidebar card" width={90} height={150} />
         <div className="flex flex-col justify-between h-full! gap-3 ">
            <p className="text-lg!">{product.name || "Easy Zipper Tote"}</p>
            <p style={{ fontFamily: "InterMedium", fontWeight: 500 }} className="text-xl!">
               Rs {product.price || "65.00"}
            </p>
            <div className="flex items-center justify-between w-60">
               <div className="flex items-center gap-3  w-fit">
                  <Button name={"Remove"} className="py-1!" pClass="font-normal!" />
               </div>
            </div>
         </div>
      </div>
   );
};

export default FavoriteCards;
