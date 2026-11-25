import Button from "@/components/Button/Button";
import { useNotification } from "@/context/NotificationContext";
import { useCartStore } from "@/Storage/UseCartStore";
import { Cart } from "@/Types/Cart/CartTypes";
import { accessories, Product, VariantSchema } from "@/Types/Collection/CollectionTypes";
import Image from "next/image";

const AccessoriesCard = ({ product, isButton = true, selectedColor, selectedMaterials, currency }: { currency: string; product: accessories; isButton: boolean; selectedColor: { hex: { code: string }; images: (string | File)[] }; selectedMaterials: VariantSchema }) => {
   const { addToCart, updateQuantity } = useCartStore();
   const { show } = useNotification();

   const materials = product?.variants?.map((variant) => variant.material) || [];
   const colorCode = selectedColor?.hex?.code;
   const rawPrice = product?.variants?.[0]?.price?.[0]?.price;
   const displayPrice = typeof rawPrice === "number" ? rawPrice.toLocaleString() : "65.00";
   const displayCurrency = currency?.replace("RS", "Rs") || "Rs";

   const GetCartSingleItem = useCartStore((state) => state.items.find((item) => item.id === product?._id && item.colorVariants === selectedColor.hex.code && item.material === materials[0]));
   const inBag = !!GetCartSingleItem;

   return (
      <div key={product?._id} className="group flex items-stretch gap-4  rounded-xl  hover:border-[#B8975A]/40  transition-all duration-200">
         {/* Image */}
         <div className="relative w-26 h-32 shrink-0 overflow-hidden rounded-lg bg-[#EDE8DF]">
            <Image src={(product?.thumbnail?.[0] as string) || "/Dummy/Product/ProductImg.png"} alt={product?.name || "accessory"} fill sizes="96px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
         </div>

         {/* Info */}
         <div className="flex flex-1 min-w-0 flex-col justify-between gap-3">
            <div className="flex flex-col gap-1.5">
               <p className="text-headingColor font-medium line-clamp-1">{product?.name || "Easy Zipper Tote"}</p>

               {/* Material + color */}
               {(materials || colorCode) && (
                  <div className="flex items-center gap-2 flex-wrap">
                     {/* {material && <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#B8975A]/30 text-[#5E5F60]">{material}</span>} */}
                     {materials && materials.map((item) => <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#B8975A]/30 text-[#5E5F60]">{item}</span>)}
                     {colorCode && <span className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: colorCode }} />}
                  </div>
               )}

               <p className="text-lg! font-medium text-headingColor">
                  {displayCurrency} {displayPrice}
               </p>
            </div>

            {isButton && (
               <div className="flex items-center gap-3 w-fit">
                  <Button
                     name={inBag ? "Already In Bag" : "Add To Bag"}
                     className="py-1!"
                     disabled={inBag}
                     pClass="font-normal!"
                     onClick={() => {
                        const result = addToCart(
                           {
                              id: product?._id || "",
                              name: product?.name || "",
                              images: (product?.thumbnail?.[0] as any) || "",
                              colorVariants: product.variants?.[0]?.colors?.[0]?.hex?.code || "",
                              material: materials[0],
                              price: rawPrice ?? 0,
                              stock: selectedMaterials?.stock || 0,
                              currency,
                           },
                           1,
                        );
                        if (!result.success) {
                           show({
                              type: "toast",
                              variant: "error",
                              title: "Out of Stock",
                              message: result.message || "This product is out of stock.",
                           });
                        }
                     }}
                  />
               </div>
            )}
         </div>
      </div>
   );
};

export default AccessoriesCard;

// {
//     "id": "6b05db41fa9f4e40f5ab2f82",
//     "name": "Prem Leather Jacket",
//     "images": "https://res.cloudinary.com/djnsp1p8r/image/upload/v1795545918/products/thumbnails/sikz108aljnmkpfngxt9.jpg",
//     "colorVariants": "",
//     "material": "Leather",
//     "price": 25000,
//     "stock": 123,
//     "currency": "RS"
// }

// {
//     "id": "6b05db41fa9f4e40f5ab2f82",
//     "name": "Prem Leather Jacket",
//     "images": "https://res.cloudinary.com/djnsp1p8r/image/upload/v1795545915/products/i0xgi2tv9rmoxjlmqvzx.jpg",
//     "colorVariants": "#000000",
//     "material": "Leather",
//     "price": 25000,
//     "stock": 1000,
//     "currency": "RS"
// }
