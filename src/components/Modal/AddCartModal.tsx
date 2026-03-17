import { useEffect, useEffectEvent, useRef, useState } from "react";
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
   const [activeIndex, setActiveIndex] = useState(0);
   const [current, setCurrent] = useState(0);

   const startX = useRef(0);
   const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

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

   const images = [1, 2, 3, 4, 5, 6, 7, 8];

   const goTo = (idx: number) => {
      setCurrent(Math.max(0, Math.min(images.length - 1, idx)));
   };

   const handleTouchStart = (e: React.TouchEvent) => {
      startX.current = e.touches[0].clientX;
   };

   const handleTouchEnd = (e: React.TouchEvent) => {
      const diff = startX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
   };

   // Scroll function add karo
   const scrollToImage = (index: number) => {
      imageRefs.current[index]?.scrollIntoView({
         behavior: "smooth",
         block: "center",
      });
   };

   return (
      <Modal
         isOpen={openModal}
         onClose={() => {
            setOpenModal(false);
            setQuantity(1);
         }}
      >
         <div className="fixed z-70 top-1/2 left-1/2 w-[90vw] h-[90vh] max-md:flex-col max-[950px]:gap-10 -translate-x-1/2 -translate-y-1/2 bg-white flex   rounded-lg overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="pl-5 max-[950px]:pl-0 flex flex-col xl:w-auto w-15 gap-2 max-xl:items-center max-xl:justify-center sticky top-10 max-xl:h-[calc(100vh-150px)]  overflow-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[950px]:hidden">
               {images.map((_, i) => (
                  <div
                     key={i}
                     onClick={() => scrollToImage(i)} // 👈 yeh add karo
                     className="cursor-pointer"
                  >
                     <Image src={"/Dummy/Product/ProductImg2.png"} width={100} height={120} alt="Product side image" className={`xl:flex hidden border transition-all duration-300 ${activeIndex === i ? "border-textBlack" : "border-transparent"}`} />
                     <div className={`w-4 h-4 bg-transparent border border-textBlack rounded-full xl:hidden flex justify-center items-center `}>
                        <div className={`rounded-full transition-all duration-300 ${activeIndex === i ? "bg-textBlack  w-full h-full" : "bg-transparent  w-0 h-0"}`} />
                     </div>
                  </div>
               ))}
            </div>
            <div className="flex-col gap-5 md:flex hidden py-10! sm:pl-10">
               {images.map((_, i) => (
                  <div
                     key={i}
                     ref={(el) => {
                        imageRefs.current[i] = el;
                     }}
                  >
                     <Image src={"/Dummy/Product/ProductImg2.png"} width={800} height={900} alt="Product side image" />
                  </div>
               ))}
            </div>
            <div className="md:hidden w-full">
               {/* Scroller */}
               <div className="overflow-hidden " onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                  <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                     {images.map((src, i) => (
                        <div key={i} className="min-w-full">
                           <Image src={"/Dummy/Product/ProductImg2.png"} width={800} height={1000} alt={`Product image ${i + 1}`} className="w-full object-cover" />
                        </div>
                     ))}
                  </div>
               </div>
               {/* Dots */}
               <div className="flex justify-center gap-1.5 mt-3">
                  {images.map((_, i) => (
                     <button key={i} onClick={() => goTo(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-black" : "w-2 bg-gray-300"}`} />
                  ))}
               </div>
            </div>
            <div className=" md:p-10 px-5 flex flex-col gap-10 md:w-200 top-0 sticky md:max-h-[calc(100vh-50px)] pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
               <div className="flex flex-col gap-2.5">
                  <h2 className="text-headingColor">{selectedProduct?.name}</h2>
                  <h3 className="text-[20px]! text-headingColor">Rs {selectedProduct?.price}</h3>
               </div>

               <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                     <p className="text-headingColor">Color - Green</p>
                     <div className="flex items-center flex-wrap gap-2">
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
                     <div className="flex items-center flex-wrap gap-3.5">
                        {selectedProduct?.material?.map((materials, i) => (
                           <div key={i} className={`cursor-pointer active:scale-99 py-2 px-6 rounded-full border-2 ${selectedMaterials === materials ? "border-BtnBlack bg-BtnBlack" : "border-gray-400 bg-white"} `} onClick={() => setSelectedMaterials(materials)}>
                              <p className={`${selectedMaterials === materials ? "text-white" : "text-textBlack"}  tracking-wide`}>{materials}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="flex gap-5 2xl:w-150 max-[950px]:flex-col">
                  <div className="flex items-center gap-3 px-6 py-2 border-2 border-gray-400 rounded-full md:max-w-80 w-fit ">
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
