"use client";
import { useFavoriteStore } from "@/Storage/UseFavoriteStore";
import { Product, colorVariants } from "@/Types/Collection/CollectionTypes";
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
   const [selectedColor, setSelectedColor] = useState<colorVariants>({ hex: { code: "", colorName: "" }, images: [] });

   const { toggleFavorite, removeFromFavorites } = useFavoriteStore();

   const isProductFavorite = useFavoriteStore((state) => state.favorites.some((fav) => fav.id === data?._id));

   const originalPrice = data.isVariable ? (data.variants?.[0]?.price?.[0]?.price ?? 0) : ((data as any)?.pricing?.[0]?.price ?? 0);

   const discountValue = data.isVariable ? data.variants[0]?.price?.[0]?.discountValue : (data as any)?.pricing?.[0]?.discountValue;

   const discountPercentage = originalPrice > 0 ? Math.round((discountValue / originalPrice) * 100) : 0;

   const Showimage = isHover ? (data as { images?: string[] })?.images?.[0] : selectedColor.images.length > 0 ? selectedColor.images?.[0] : (data as { thumbnail?: string[] })?.thumbnail?.[0];

   return (
      <Link href={`/product/${data.slug || "tan"}`} className="group cursor-pointer  overflow-hidden   relative" title={data.name}>
         <div className="w-full h-full relative flex flex-col gap-3">
            <div className="xl:w-[calc((100vw/3.8))]  2xl:h-150 xl:h-120 lg:h-100 sm:h-125 h-150 relative bg-[#F7F7F7]">
               <div className="relative">
                  <Image key={Showimage as string} width={500} height={800} src={Showimage as string} alt="Product Image" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className="object-contain 2xl:h-150 xl:h-115 lg:h-100 sm:h-125 h-150 max-[600px]:w-full" />

                  <div className="flex w-full justify-between absolute xl:top-8 top-6 left-0">
                     <span className="bg-BtnBlack py-1.5 px-4 rounded-r-full ">
                        <p className="text-white max-xl:text-[10px]!">{data.badge || "Hot Sellers"}</p>
                     </span>
                  </div>
                  <div
                     onClick={(e) => {
                        e.preventDefault();
                     }}
                     className="absolute top-0 xl:right-16 right-5 flex flex-col gap-2 justify-between 2xl:h-150 xl:h-120 lg:h-100 sm:h-125 h-150 xl:py-8 py-6"
                  >
                     {isProductFavorite ? (
                        <Image
                           onClick={() => {
                              removeFromFavorites(data._id || "", data.variants?.[0]?.colors?.[0]?.hex?.code || "", data.variants?.[0]?.material);
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
                                 id: data._id || "",
                                 name: data.name || "",
                                 images: (data.images?.[0] as string) || "",
                                 price: data.variants?.[0]?.price?.[0]?.price || 0,
                                 discountPrice: data.variants?.[0]?.price?.[0]?.discountValue || 0,
                                 stock: data.stock || 0,
                                 colorVariants: data.variants?.[0]?.colors?.[0]?.hex?.code || "",
                                 material: data.variants?.[0]?.material,
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
                        onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
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
            </div>
            <div className=" flex flex-col gap-2">
               <div
                  className="flex items-center gap-2"
                  onClick={(e) => {
                     e.preventDefault();
                  }}
               >
                  {data?.variants?.map((item) =>
                     item.colors
                        ?.filter((item) => item.hex.code && item.images)
                        .map((item) =>
                           selectedColor.hex?.code === item.hex?.code ? (
                              <div className="xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 border-2 border-gray-500 cursor-pointer  rounded-full flex items-center justify-center" key={item.hex.code}>
                                 <div className={`xl:w-3 xl:h-3 w-2 h-2 rounded-full ${item.hex}`} style={{ background: item.hex?.code }} />
                              </div>
                           ) : (
                              <div onClick={() => setSelectedColor({ hex: { code: item.hex?.code, colorName: item.hex?.colorName }, images: item.images })} key={item.hex?.code} className="xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.hex?.code }} />
                           ),
                        ),
                  )}
               </div>
               <h3 className="2xl:text-[20px]! xl:text-[19px]! text-[16px]! fontInterRegular">{data.name || "Easy Zipper Tote Bag"}</h3>
               <div className="flex items-center gap-4">
                  <p>Rs {originalPrice || "11,999"}</p>
                  {((!data.isVariable && ((data as any)?.pricing?.[0]?.discountValue ?? 0) > 0) || (data.isVariable && (data.variants?.[0]?.price?.[0]?.discountValue ?? 0) > 0)) && (
                     <span className="bg-BtnBlack px-2 py-0.5">
                        <p className="text-white">
                           -{discountPercentage}% Rs {discountValue}
                        </p>
                     </span>
                  )}
               </div>
            </div>
         </div>
      </Link>
   );
};

export default ProductCard;
