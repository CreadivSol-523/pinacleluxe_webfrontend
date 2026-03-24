import FavoriteCards from "@/components/Cards/FavoriteCards/FavoriteCards";
import { useFavoriteStore } from "@/Storage/UseFavoriteStore";
import { X } from "lucide-react";

const Favorite = ({ isOpen, setIsSidebarOpen }: { isOpen: boolean; setIsSidebarOpen: (isOpen: boolean) => void }) => {
   const favoriteItems = useFavoriteStore((state) => state.favorites);
   console.log(favoriteItems);
   return (
      <aside className={`sm:w-100 w-full h-full bg-white fixed transition-all duration-500 ${isOpen ? "sm:right-0 translate-x-0" : "sm:-right-full  translate-x-full"} z-60!`}>
         <div className="p-5 flex justify-between items-center border-b border-b-gray-200">
            <h3>Favorite Items</h3>
            <X className="cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
         </div>
         <div className="flex items-start py-10 justify-start px-6 h-full">
            <div className="flex flex-col gap-5.5 h-[80vh] overflow-y-scroll overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-10">
               {favoriteItems.length > 0 && favoriteItems.map((item) => <FavoriteCards product={item} key={item.id + item.colorVariants + item.material} />)}
            </div>

            {favoriteItems.length <= 0 && <h3 className="uppercase h-[80vh] flex items-center w-full justify-center text-gray-300">No item in Favorite</h3>}
         </div>
      </aside>
   );
};

export default Favorite;
