"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; crumb: string }> = {
   "/admin/dashboard": { title: "Dashboard", crumb: "Admin / Overview" },
   "/admin/products": { title: "Products", crumb: "Admin / Catalogue / Products" },
   "/admin/categories": { title: "Categories", crumb: "Admin / Catalogue / Categories" },
   "/admin/inventory": { title: "Inventory", crumb: "Admin / Catalogue / Inventory" },
   "/admin/cms": { title: "Banners & CMS", crumb: "Admin / Content / Banners" },
   "/admin/sliders": { title: "Sliders", crumb: "Admin / Content / Sliders" },
   "/admin/orders": { title: "Orders", crumb: "Admin / Commerce / Orders" },
   "/admin/customers": { title: "Customers", crumb: "Admin / Commerce / Customers" },
};

const actionMap: Record<string, string> = {
   "/admin/products": "Add Product",
   "/admin/categories": "Add Category",
   "/admin/inventory": "Update Stock",
   "/admin/cms": "Add Banner",
   "/admin/sliders": "Add Slide",
};

interface TopbarProps {
   onMenuClick: () => void;
   onActionClick?: () => void;
}

export default function Topbar({ onMenuClick, onActionClick }: TopbarProps) {
   const pathname = usePathname();
   const meta = pageTitles[pathname] ?? { title: "Admin", crumb: "Admin" };
   const actionLabel = actionMap[pathname];

   return (
      <header className="h-20 bg-staticSecondaryBG border-b border-[#B8975A]/20 px-5 lg:px-7 flex items-center justify-between shrink-0">
         {/* Left */}
         <div className="flex items-center gap-3">
            {/* Hamburger — visible on mobile only */}
            <button onClick={onMenuClick} className="lg:hidden w-8 h-8 flex items-center justify-center text-[#5E5F60] hover:text-headingColor transition-colors">
               <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
               </svg>
            </button>
            <div>
               <h4 className="font-serif text-[18px] lg:text-[20px] font-semibold text-headingColor tracking-[0.04em] leading-none">{meta.title}</h4>
               <p className="text-[10px] lg:text-[11px] text-[#5E5F60] tracking-[0.05em] mt-0.5 hidden sm:block">{meta.crumb}</p>
            </div>
         </div>

         {/* Right */}
         <div className="flex items-center gap-2 lg:gap-3">
            {/* Search */}
            <button className="w-8 h-8 lg:w-8.5 lg:h-8.5 rounded-lg border border-[#B8975A]/20 bg-transparent flex items-center justify-center text-[#5E5F60] hover:bg-[#E8E0D0] hover:text-headingColor transition-all duration-150">
               <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
               </svg>
            </button>

            {/* Notifications */}
            <button className="w-8 h-8 lg:w-8.5 lg:h-8.5 rounded-lg border border-[#B8975A]/20 bg-transparent flex items-center justify-center text-[#5E5F60] hover:bg-[#E8E0D0] hover:text-headingColor transition-all duration-150 relative">
               <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2a4 4 0 014 4c0 2.5.7 4 1.5 5H2.5C3.3 10 4 8.5 4 6a4 4 0 014-4Z" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M6 11c0 1.1.9 2 2 2s2-.9 2-2" stroke="currentColor" strokeWidth="1.3" />
               </svg>
               <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#B8975A]" />
            </button>

            {/* CTA — hidden on very small screens */}
            {actionLabel && (
               <button onClick={onActionClick} className="hidden sm:flex items-center gap-1.5 px-3 lg:px-4 py-2 bg-primaryBG text-[#B8975A] text-xs font-medium tracking-[0.06em] rounded-lg hover:bg-headingColor transition-all duration-150">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                     <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {actionLabel}
               </button>
            )}
         </div>
      </header>
   );
}
