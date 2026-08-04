import Button from "@/components/Button/Button";
import { useCartStore } from "@/Storage/UseCartStore";
import { Cart } from "@/Types/Cart/CartTypes";
import { Product, VariantSchema } from "@/Types/Collection/CollectionTypes";
import Image from "next/image";

const AccessoriesCard = ({ product, isButton = true, selectedColor, selectedMaterials }: { product: Product; isButton: boolean; selectedColor: { hex: { code: string }; images: (string | File)[] }; selectedMaterials: VariantSchema }) => {
   const { addToCart, updateQuantity } = useCartStore();

   const GetCartSingleItem = useCartStore((state) => state.items.find((item) => item.id === product?._id && item.colorVariants === selectedColor.hex.code && item.material === selectedMaterials.material));

   return (
      <div className="flex items-center gap-6 " key={product?._id}>
         <Image src={(product?.images?.[0] as string) || "/Dummy/Product/ProductImg.png"} alt="sidebar card" width={80} height={100} />
         <div className="flex flex-col justify-between  gap-2.5 ">
            <p className="text-headingColor">{product?.name || "Easy Zipper Tote"}</p>
            <p style={{ fontFamily: "InterMedium", fontWeight: 500 }} className="text-lg! text-headingColor">
               Rs {selectedMaterials?.price?.[0]?.price || "65.00"}
            </p>
            {isButton && (
               <div className="flex items-center gap-3  w-fit">
                  <Button
                     name={GetCartSingleItem ? "Already In Bag" : "Add To Bag"}
                     className="py-1!"
                     disabled={GetCartSingleItem ? true : false}
                     pClass="font-normal!"
                     onClick={() => {
                        addToCart(
                           {
                              id: product?._id || "",
                              name: product?.name || "",
                              images: (product?.images?.[0] as any) || "",
                              colorVariants: selectedColor.hex.code,
                              material: selectedMaterials.material,
                              price: selectedMaterials?.price?.[0]?.price ?? 0,
                              stock: selectedMaterials?.stock || 0,
                           },
                           1,
                        );
                     }}
                  />
               </div>
            )}
         </div>
      </div>
   );
};

export default AccessoriesCard;
