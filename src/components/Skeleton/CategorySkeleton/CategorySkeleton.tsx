export const CategoryCardSkeleton = () => {
   return (
      <div className="relative overflow-hidden">
         <div className="w-full aspect-4/5 bg-gray-300 animate-pulse relative">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />

            <div className="absolute bottom-0 left-0 p-6 w-full">
               <div className="h-4 w-24 bg-gray-400 rounded-md" />
            </div>
         </div>
      </div>
   );
};

export default CategoryCardSkeleton;
