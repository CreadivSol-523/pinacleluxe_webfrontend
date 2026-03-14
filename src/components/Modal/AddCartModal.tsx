import { useEffect, useEffectEvent, useState } from "react";
import Modal from "./Modal";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import Button from "../Button/Button";
import { ModalType } from "@/Types/Modal/ModalType";
import { useCartStore } from "@/Storage/UseCartStore";

const AddCartModal = ({ setOpenModal, openModal, selectedProduct }: ModalType) => {
   const [selectedColor, setSelectedColor] = useState<{ hex: string; image: string }>({ hex: "", image: "" });
   const [selectedMaterials, setSelectedMaterials] = useState<string>(selectedProduct?.material?.[0] || "");
   const [quantity, setQuantity] = useState(1);

   const { addToCart, updateQuantity } = useCartStore();

   const GetCartSingleItem = useCartStore((state) => state.items.find((item) => item.id === selectedProduct?.id && item.color.hex === selectedColor.hex && item.material === selectedMaterials));

   const GetQuantitySelected = useEffectEvent(() => {
      setQuantity(GetCartSingleItem?.quantity || 1);
   });

   useEffect(() => {
      GetQuantitySelected();
   }, [GetCartSingleItem, openModal]);

   // Update Quantity
   const handleIncreaseQuantity = () => {
      const updateProductQuantity = quantity < (selectedProduct?.stock ?? 0) ? quantity + 1 : quantity;
      setQuantity(updateProductQuantity);
      updateQuantity(selectedProduct?.id || "", updateProductQuantity, selectedColor.hex, selectedMaterials);
   };

   const handleDecreaseQuantity = () => {
      const updateProductQuantity = quantity <= 1 ? 1 : quantity - 1;
      setQuantity(updateProductQuantity);
      updateQuantity(selectedProduct?.id || "", updateProductQuantity, selectedColor.hex, selectedMaterials);
   };

   const onProductChange = useEffectEvent(() => {
      setSelectedColor({ hex: selectedProduct?.colors?.[0].hex || "", image: selectedProduct?.images?.[0] || "" });
      setSelectedMaterials(selectedProduct?.material?.[0] || "");
   });

   useEffect(() => {
      onProductChange();
   }, [selectedProduct]);

   return (
      <Modal
         isOpen={openModal}
         onClose={() => {
            setOpenModal(false);
            setQuantity(1);
         }}
      >
         <div className="fixed z-70 top-1/2 left-1/2 w-[90vw] h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white flex gap-12 p-10 rounded-lg overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-2  sticky top-0 h--[calc(100vh-150px)] overflow-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
               <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
               <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
               <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
               <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
               <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
               <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
               <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" />
               <Image src={"/Dummy/Product/ProductImg.png"} width={100} height={120} alt="Product side image" />
            </div>
            <div className="flex flex-col gap-5">
               <Image src={"/Dummy/Product/ProductImg2.png"} width={700} height={900} alt="Product side image" />
               <Image src={"/Dummy/Product/ProductImg2.png"} width={700} height={900} alt="Product side image" />
               <Image src={"/Dummy/Product/ProductImg2.png"} width={700} height={900} alt="Product side image" />
               <Image src={"/Dummy/Product/ProductImg2.png"} width={700} height={900} alt="Product side image" />
            </div>
            <div className="flex flex-col gap-10 w-200 sticky top-0 max-h-[calc(100vh-50px)] pb-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
               <div className="flex flex-col gap-2.5">
                  <h2 className="text-headingColor">{selectedProduct?.name}</h2>
                  <h3 className="text-[20px]! text-headingColor">Rs {selectedProduct?.price}</h3>
               </div>

               <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                     <p className="text-headingColor">Color - Green</p>
                     <div className="flex items-center  gap-2">
                        {selectedProduct?.colors?.map((item, i) =>
                           selectedColor.hex === item.hex ? (
                              <div className="w-6 h-6 border-2 border-gray-500 cursor-pointer  rounded-full flex items-center justify-center" key={item.hex}>
                                 <div className={`w-4 h-4 rounded-full bg-[${item.hex}]`} style={{ background: item.hex }} />
                              </div>
                           ) : (
                              <div onClick={() => setSelectedColor({ hex: item.hex, image: item.image })} className={`w-6 h-6 cursor-pointer rounded-full ${item.hex}`} style={{ background: item.hex }} key={i} />
                           ),
                        )}
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <p className="text-headingColor">Material:</p>
                     <div className="flex items-center  gap-3.5">
                        {selectedProduct?.material?.map((materials, i) => (
                           <div key={i} className={`cursor-pointer active:scale-99 py-2 px-6 rounded-full border-2 ${selectedMaterials === materials ? "border-BtnBlack bg-BtnBlack" : "border-gray-400 bg-white"} `} onClick={() => setSelectedMaterials(materials)}>
                              <p className={`${selectedMaterials === materials ? "text-white" : "text-textBlack"}  tracking-wide`}>{materials}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="flex gap-5 w-150">
                  <div className="flex items-center gap-3 px-6 py-2 border-2 border-gray-400 rounded-full max-w-80 ">
                     <Minus
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => {
                           if (GetCartSingleItem) {
                              handleDecreaseQuantity();
                           } else {
                              setQuantity((prev) => prev - 1);
                           }
                        }}
                     />
                     <p className="w-5 text-center">{GetCartSingleItem != undefined ? GetCartSingleItem?.quantity : quantity}</p>
                     <Plus
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => {
                           if (GetCartSingleItem) {
                              handleIncreaseQuantity();
                           } else {
                              setQuantity((prev) => (prev < (selectedProduct?.stock ?? 0) ? prev + 1 : prev));
                           }
                        }}
                     />
                  </div>
                  <Button
                     name={GetCartSingleItem ? "Already In Bag" : "Add To Bag"}
                     className="w-full"
                     disabled={GetCartSingleItem ? true : false}
                     onClick={() => {
                        if (GetCartSingleItem) {
                           console.log("object");
                        } else {
                           addToCart(
                              {
                                 id: selectedProduct?.id || "",
                                 name: selectedProduct?.name || "",
                                 image: selectedProduct?.images?.[0] || "",
                                 color: selectedColor,
                                 material: selectedMaterials,
                                 price: selectedProduct?.price ?? 0,
                                 stock: selectedProduct?.stock || 0,
                              },
                              quantity,
                           );
                           setOpenModal(false);
                        }
                     }}
                  />
               </div>
            </div>
         </div>
      </Modal>
   );
};

export default AddCartModal;
