"use client";

import { useState } from "react";
import Link from "next/link";
import OrdersChart from "./OrderChart/OrderChart";
import Table from "@/components/Table/Table";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const stats = [
   {
      label: "Total Products",
      value: "248",
      change: "+12 this month",
      up: true,
      icon: (
         <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 5l1.5 8h9L15 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M1 5h16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      label: "Total Orders",
      value: "1,340",
      change: "+34 today",
      up: true,
      icon: (
         <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M6 8h6M6 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      label: "Revenue (Monthly)",
      value: "Rs 2.4M",
      change: "+22% vs last month",
      up: true,
      icon: (
         <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" />
            <path d="M9 5v1.5M9 11.5V13M6.5 8.5c0-1 1.1-1.5 2.5-1.5s2.5.5 2.5 1.5-1.1 1.5-2.5 1.5-2.5.5-2.5 1.5 1.1 1.5 2.5 1.5 2.5-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      label: "Low Stock Items",
      value: "7",
      change: "Needs attention",
      up: false,
      icon: (
         <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L2 15h14L9 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M9 8v3M9 13h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
         </svg>
      ),
   },
];

const topProducts = [
   { name: "Easy Zipper Tote", category: "Totes", sold: 142, revenue: "Rs 1.56M" },
   { name: "Jo Malone Sakura", category: "Shoulder", sold: 98, revenue: "Rs 1.07M" },
   { name: "Structured Hobo", category: "Hobo", sold: 76, revenue: "Rs 1.06M" },
   { name: "Mini Crossbody", category: "Small Leather", sold: 64, revenue: "Rs 544K" },
];

const quickActions = [
   {
      label: "Add Product",
      href: "/admin/products/new",
      icon: (
         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 6l2 10h8l2-10" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M2 6h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M10 10v4M8 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      label: "Add Category",
      href: "/admin/categories/new",
      icon: (
         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M14.5 11v6M11.5 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      label: "Manage Banners",
      href: "/admin/cms",
      icon: (
         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="3" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7 17h6M10 13v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      label: "Update Inventory",
      href: "/admin/inventory",
      icon: (
         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h10M3 15h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M16 13l2 2-2 2M18 15h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
      ),
   },
   {
      label: "View Orders",
      href: "/admin/orders",
      icon: (
         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M6 9h8M6 13h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      label: "View Customers",
      href: "/admin/customers",
      icon: (
         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M3 18c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
         </svg>
      ),
   },
];

const statusStyles: Record<string, string> = {
   Shipped: "bg-green-50 text-green-700",
   Pending: "bg-amber-50 text-amber-700",
   Processing: "bg-blue-50 text-blue-700",
};

// ─── Orders Bar Chart ─────────────────────────────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
   const [currentPage, setCurrentPage] = useState(0);

   const columns = [
      {
         key: "id",
         header: "Order",
         mapKey: "_id",
         render: (item: string) => <span className="text-[#B8975A]">{item}</span>,
      },
      {
         key: "customer",
         header: "Customer",
         mapKey: "Customer",
      },
      {
         key: "product",
         header: "Product",
         mapKey: "Product",
      },
      {
         key: "amount",
         header: "Amount",
         mapKey: "Amount",
      },
      {
         key: "status",
         header: "Status",
         mapKey: "Status",
         render: (item: string) => <span className={`text-[10px] py-1 rounded-full font-medium px-2.5 text-start ${statusStyles[item]}`}>{item}</span>,
      },
   ];

   const recentOrders = [
      { id: "#4821", customer: "Aisha Khan", product: "Easy Zipper Tote", amount: "Rs 11,000", status: "Shipped" },
      { id: "#4820", customer: "Sara Malik", product: "Jo Malone Sakura", amount: "Rs 11,000", status: "Pending" },
      { id: "#4819", customer: "Hira Baig", product: "Mini Crossbody", amount: "Rs 8,500", status: "Processing" },
      { id: "#4818", customer: "Nadia Siddiqui", product: "Structured Hobo", amount: "Rs 14,000", status: "Shipped" },
      { id: "#4817", customer: "Zara Ahmed", product: "Easy Zipper Tote", amount: "Rs 22,000", status: "Pending" },
   ];

   return (
      <div className="space-y-6">
         {/* ── Stat Cards ── */}
         <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {stats.map((s) => (
               <div key={s.label} className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] tracking-[0.14em] uppercase text-[#5E5F60]">{s.label}</span>
                     <span className="text-[#B8975A]/60">{s.icon}</span>
                  </div>
                  <p className="font-serif text-[28px] font-semibold text-headingColor leading-none">{s.value}</p>
                  <p className={`text-[11px] mt-2 ${s.up ? "text-green-600" : "text-red-500"}`}>{s.change}</p>
               </div>
            ))}
         </div>

         {/* ── Orders Graph + Quick Actions ── */}
         <div className="grid grid-cols-3 gap-4">
            {/* Orders Graph */}
            <div className="2xl:col-span-2 col-span-3 bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5 flex flex-col justify-between">
               <div className="flex items-center justify-between mb-5">
                  <p className="text-[11px] tracking-[0.12em] uppercase text-headingColor font-medium">Orders — Last 7 Days</p>
                  <span className="text-[11px] text-[#B8975A]">246 total</span>
               </div>
               <OrdersChart />
            </div>

            {/* Quick Actions */}
            <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5 max-2xl:col-span-2 max-md:col-span-3">
               <p className="text-[11px] tracking-[0.12em] uppercase text-headingColor font-medium mb-4">Quick Actions</p>
               <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((a) => (
                     <Link key={a.label} href={a.href} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[#B8975A]/15 text-[#5E5F60] hover:border-[#B8975A]/40 hover:text-headingColor hover:bg-[#B8975A]/5 transition-all duration-150">
                        {a.icon}
                        <span className="text-[10px] text-center leading-tight">{a.label}</span>
                     </Link>
                  ))}
               </div>
            </div>
         </div>

         {/* ── Recent Orders + Top Products ── */}
         <div className="grid grid-cols-3 gap-4">
            {/* Recent Orders */}
            <div className="2xl:col-span-2 col-span-3 bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl overflow-hidden">
               <Table currentPage={currentPage} setCurrentPage={setCurrentPage} tableName="Recent Orders" BtnName={"Add Appointment"} columns={columns} data={recentOrders || []} actions={false} keyField="_id" />
            </div>

            {/* Top Selling Products */}
            <div className="bg-staticSecondaryBG 2xl:col-span-1 lg:col-span-2 col-span-3 border border-[#B8975A]/15 rounded-xl overflow-hidden">
               <div className="px-5 py-4 border-b border-[#B8975A]/10 flex items-center justify-between">
                  <p className="text-[11px] tracking-[0.12em] uppercase text-headingColor font-medium">Top Selling</p>
                  <Link href="/admin/products" className="text-[11px] text-[#B8975A] hover:underline">
                     View all
                  </Link>
               </div>
               <div className="divide-y divide-[#B8975A]/8">
                  {topProducts.map((p, i) => (
                     <div key={p.name} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#B8975A]/3 transition-colors">
                        <span className="text-[11px] font-medium text-[#B8975A]/50 w-4">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                           <p className="text-[12px] font-medium text-headingColor truncate">{p.name}</p>
                           <p className="text-[10px] text-[#5E5F60] mt-0.5">
                              {p.category} · {p.sold} sold
                           </p>
                        </div>
                        <p className="text-[12px] font-serif font-medium text-headingColor whitespace-nowrap">{p.revenue}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
