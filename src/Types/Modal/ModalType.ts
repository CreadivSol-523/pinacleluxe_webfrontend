import { Product, productCart } from "../Collection/CollectionTypes";

export interface ModalType {
   setOpenModal: (value: boolean) => void;
   openModal: boolean;
   selectedProduct: Product | null;
}
