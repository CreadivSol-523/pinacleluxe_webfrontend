import Skeleton from "@/components/Skeleton/Skeleton"; // adjust path

const ProductCardSkeleton = () => {
   return (
      <div className="w-full h-full relative flex flex-col gap-3">
         {/* Image block - matches product image container breakpoints */}
         <Skeleton className="w-full 2xl:h-150 xl:h-120 lg:h-100 sm:h-125 h-150" />

         {/* Info block */}
         <div className="flex flex-col gap-2">
            {/* Color dots */}
            <div className="flex items-center gap-2">
               <Skeleton className="xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 rounded-full" />
               <Skeleton className="xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 rounded-full" />
            </div>

            {/* Name */}
            <Skeleton className="2xl:h-6 xl:h-5.5 h-5 w-3/4" />

            {/* Price row */}
            <div className="flex items-center gap-4">
               <Skeleton className="h-4 w-16" />
               <Skeleton className="h-6 w-24" />
            </div>
         </div>
      </div>
   );
};

export default ProductCardSkeleton;
