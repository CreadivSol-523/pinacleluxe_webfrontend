import { ShoppingBag } from "lucide-react";

interface NoProductsFoundProps {
   title?: string;
   message?: string;
   actionLabel?: string;
   onAction?: () => void;
   className?: string;
}

/**
 * Reusable empty-state component for when a product listing has zero results.
 * Matches Pinacle Luxe theme: minimal, black/off-white, thin borders, uppercase tracking.
 *
 * Usage:
 *   {products.length === 0 && !isLoading ? (
 *      <NoProductsFound />
 *   ) : (
 *      // your product grid
 *   )}
 *
 *  Or with a custom message + reset filters button:
 *   <NoProductsFound
 *      title="No Products Available"
 *      message="We couldn't find anything matching your filters."
 *      actionLabel="Clear Filters"
 *      onAction={() => setProductFilters({ badge: "", category: "", material: "", color: "" })}
 *   />
 */
const MessageModal = ({ title = "No Products Available", message = "We couldn't find any products right now. Please check back soon or explore our other collections.", actionLabel, onAction, className = "" }: NoProductsFoundProps) => {
   return (
      <div className={`flex flex-col items-center justify-center text-center w-full py-24 md:py-32 ${className}`}>
         {/* Icon */}
         <div className="w-16 h-16 rounded-full border border-black/15 flex items-center justify-center mb-6">
            <ShoppingBag className="w-6 h-6 text-black/40" strokeWidth={1.5} />
         </div>

         {/* Title */}
         <h3 className="text-lg md:text-xl tracking-wide uppercase text-black font-medium mb-2">{title}</h3>

         {/* Message */}
         <p className="text-sm md:text-base text-black/50 max-w-md leading-relaxed mb-6">{message}</p>

         {/* Optional action button (e.g. Clear Filters / Continue Shopping) */}
         {actionLabel && onAction && (
            <button onClick={onAction} className="px-6 py-2.5 text-xs md:text-sm uppercase tracking-wider border border-black rounded-full text-black hover:bg-black hover:text-white transition-colors duration-200">
               {actionLabel}
            </button>
         )}
      </div>
   );
};

export default MessageModal;
