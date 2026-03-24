"use client";
import { useFavoriteStore } from "@/Storage/UseFavoriteStore";
import { Product, productCart, colorVariants } from "@/Types/Collection/CollectionTypes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ProductCardProps = {
   data: Product;
   isCart?: (value: boolean) => void;
   AddCartDetail?: (value: any) => void;
};

const ProductCard = ({ data, isCart, AddCartDetail }: ProductCardProps) => {
   const [isHover, setIsHover] = useState(false);
   const [selectedColor, setSelectedColor] = useState<colorVariants>({ hex: "", images: [] });

   const { toggleFavorite, removeFromFavorites } = useFavoriteStore();

   const isProductFavorite = useFavoriteStore((state) => state.favorites.some((fav) => fav.id === data?.id && fav.colorVariants === data.colorVariants?.[0]?.hex && fav.material === data.material?.[0]));

   return (
      <Link href={`/product/${data.slug || "tan"}`} className="group cursor-pointer  overflow-hidden   relative" title={data.name}>
         <div className="w-full h-full relative flex flex-col gap-3">
            <div className="relative ">
               <Image
                  width={500}
                  height={800}
                  src={isHover ? data?.gallery?.[0] : selectedColor.images.length > 0 ? selectedColor.images?.[0] : data?.images?.[0] || "/Dummy/Product/ProductImg.png"}
                  alt="Category Image Here"
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  className="object-cover 2xl:h-150 xl:h-110 lg:h-80 sm:h-125 h-130 max-[600px]:w-full"
               />
               <div className="flex w-full justify-between absolute xl:top-8 top-6 left-0">
                  <span className="bg-BtnBlack py-1.5 px-4 rounded-r-full ">
                     <p className="text-white max-xl:text-[10px]!">{data.badge || "Hot Sellers"}</p>
                  </span>
               </div>
               <div
                  onClick={(e) => {
                     e.preventDefault();
                  }}
                  className="absolute top-0 xl:right-6 right-5 flex flex-col gap-2 justify-between h-full xl:py-8 py-6"
               >
                  {isProductFavorite ? (
                     <Image
                        onClick={() => {
                           removeFromFavorites(data.id || "", data.colorVariants?.[0].hex || "", data?.material?.[0]);
                        }}
                        src={"/Icons/FillFavoriteIcon.svg"}
                        width={20}
                        height={20}
                        alt="profile icon"
                        className="w-6 max-xl:w-[2vw]! max-lg:w-5! hover:scale-105 "
                     />
                  ) : (
                     <Image
                        onClick={() => {
                           toggleFavorite({
                              id: data.id || "",
                              name: data.name || "",
                              images: data.images?.[0] || "",
                              price: data.price || 0,
                              discountPrice: data.discountPrice || 0,
                              stock: data.stock || 0,
                              colorVariants: data.colorVariants?.[0].hex || "",
                              material: data.material?.[0],
                           });
                        }}
                        src={"/Icons/HeartIcon.svg"}
                        width={20}
                        height={20}
                        alt="profile icon"
                        className="w-6 max-xl:w-[2vw]! max-lg:w-5! hover:scale-105"
                     />
                  )}
                  <Image
                     onClick={() => {
                        isCart?.(true);
                        AddCartDetail?.(data);
                     }}
                     src={"/Icons/AddIcon.svg"}
                     width={20}
                     height={20}
                     alt="profile icon"
                     className="w-6 max-xl:w-[2vw]! max-lg:w-5! hover:scale-105 "
                  />
               </div>
            </div>
            <div className=" flex flex-col gap-2">
               <div
                  className="flex items-center gap-2"
                  onClick={(e) => {
                     e.preventDefault();
                  }}
               >
                  {data?.colorVariants
                     ?.filter((item) => item.hex && item.images)
                     .map((item) =>
                        selectedColor.hex === item.hex ? (
                           <div className="xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 border-2 border-gray-500 cursor-pointer  rounded-full flex items-center justify-center" key={item.hex}>
                              <div className={`xl:w-3 xl:h-3 w-2 h-2 rounded-full ${item.hex}`} style={{ background: item.hex }} />
                           </div>
                        ) : (
                           <div onClick={() => setSelectedColor({ hex: item.hex, images: item.images })} key={item.hex} className="xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.hex }} />
                        ),
                     )}
               </div>
               <h3 className="2xl:text-[20px]! xl:text-[19px]! text-[16px]! fontInterRegular">{data.name || "Easy Zipper Tote Bag"}</h3>
               <div className="flex items-center gap-4">
                  <p>Rs {data?.price || "11,999"}</p>
                  <span className="py-0.5 px-2 bg-BtnBlack">
                     <p className="text-white">-80% Rs {data?.discountPrice || "2500"}</p>
                  </span>
               </div>
            </div>
         </div>
      </Link>
   );
};

export default ProductCard;
