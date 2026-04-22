"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
   {
      label: "Overview",
      items: [
         {
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: (
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
                  <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
                  <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
                  <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4" />
               </svg>
            ),
         },
      ],
   },
   {
      label: "Catalogue",
      items: [
         {
            label: "Products",
            href: "/admin/products",
            icon: (
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
               </svg>
            ),
         },
         {
            label: "Categories",
            href: "/admin/categories",
            icon: (
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1h6l1 2H15l-2 6H4L1 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <circle cx="5.5" cy="13.5" r="1" fill="currentColor" />
                  <circle cx="12.5" cy="13.5" r="1" fill="currentColor" />
               </svg>
            ),
         },
      ],
   },
   {
      label: "Content",
      items: [
         {
            label: "Banners & CMS",
            href: "/admin/cms",
            icon: (
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="2" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 11v3" stroke="currentColor" strokeWidth="1.2" />
               </svg>
            ),
         },
         {
            label: "Sliders",
            href: "/admin/sliders",
            icon: (
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 6h12" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6 2v4M10 2v4" stroke="currentColor" strokeWidth="1.2" />
               </svg>
            ),
         },
      ],
   },
   {
      label: "Commerce",
      items: [
         {
            label: "Orders",
            href: "/admin/orders",
            icon: (
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 5l-1 7a1 1 0 01-1 1H4a1 1 0 01-1-1L2 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 5h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M10 5a2 2 0 01-4 0" stroke="currentColor" strokeWidth="1.2" />
               </svg>
            ),
         },
         {
            label: "Customers",
            href: "/admin/customers",
            icon: (
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
               </svg>
            ),
         },
      ],
   },
];

interface SidebarProps {
   isOpen: boolean;
   onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
   const pathname = usePathname();

   const isActive = (href: string) => {
      if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
      return pathname.startsWith(href);
   };

   return (
      <>
         {/* Backdrop overlay — mobile only */}
         <div
            onClick={onClose}
            className={`fixed inset-0 z-20 bg-black/50 lg:hidden transition-opacity duration-300
               ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
         />

         {/* Sidebar panel */}
         <aside
            className={`fixed lg:relative inset-y-0 left-0 z-30 w-60 shrink-0 bg-primaryBG flex flex-col h-full
               transition-transform duration-300 ease-in-out
               ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
         >
            {/* Logo */}
            <div className="px-5 py-6 border-b border-white/8 flex items-center justify-between">
               <div>
                  <p className="font-serif text-[18px] font-semibold tracking-[0.12em] uppercase text-[#B8975A]">Pinacle Luxe</p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-white/25 mt-0.5">Admin Dashboard</p>
               </div>
               {/* Close button — visible on mobile only */}
               <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white/70 transition-colors p-1">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                     <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
               </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-2">
               {navSections.map((section) => (
                  <div key={section.label} className="py-2">
                     <p className="text-[9px] tracking-[0.18em] uppercase text-white/25 px-5 pb-2">{section.label}</p>
                     {section.items.map((item) => (
                        <Link
                           key={item.href}
                           href={item.href}
                           onClick={onClose}
                           className={`flex items-center gap-2.5 px-5 py-2.5 text-[13px] border-l-2 transition-all duration-150
                              ${isActive(item.href) ? "border-[#B8975A] bg-[#B8975A]/10 text-[#D4B07A]" : "border-transparent text-white/50 hover:bg-white/5 hover:text-white/80"}`}
                        >
                           <span className={isActive(item.href) ? "opacity-100" : "opacity-60"}>{item.icon}</span>
                           {item.label}
                        </Link>
                     ))}
                  </div>
               ))}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/8 flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-full bg-[#B8975A] flex items-center justify-center text-xs font-medium text-primaryBG shrink-0">A</div>
               <div>
                  <p className="text-xs text-white/75 font-medium">Admin</p>
                  <p className="text-[10px] text-white/30 tracking-[0.05em]">Super Admin</p>
               </div>
            </div>
         </aside>
      </>
   );
}
