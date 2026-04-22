import { Copyright } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
   return (
      <footer className="bg-staticSecondaryBG lg:px-10 px-5 pt-14">
         <div className="flex flex-col gap-10">
            <div className="flex md:gap-10 sm:gap-20 gap-10 sm:flex-row flex-col">
               <div>
                  <Image src={"/Common/FooterLogo.png"} alt="Footer Logo" width={150} height={50} className="rounded-xl " />
               </div>
               <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full justify-items-end lg:gap-0 gap-10 ">
                  <div className="flex flex-col gap-2.5 max-lg:place-self-start max-sm:place-self-start! ">
                     <strong className="fontInterSemiBold">MORE FROM PINACLE LUXE</strong>
                     <ul className="flex flex-col gap-1.5">
                        <li>
                           <Link href={"/about-us"} className="hover:underline">
                              About
                           </Link>
                        </li>
                        <li>
                           <Link href={"/our-stories"} className="hover:underline">
                              Our Story
                           </Link>
                        </li>
                        <li>Design Philosophy</li>
                        <li>Careers (Coming Soon)</li>
                        <li>Sustainability (Coming Soon)</li>
                     </ul>
                  </div>
                  <div className="flex flex-col gap-2.5 max-md:place-self-start max-md:pl-18 max-sm:place-self-start! max-sm:pl-0">
                     <strong className="fontInterSemiBold">CUSTOMER CARE</strong>
                     <ul className="flex flex-col gap-1.5">
                        <li>
                           <Link href={"/contact-us"} className="hover:underline">
                              Contact Us
                           </Link>
                        </li>
                        <li>
                           <Link href={"/frequently-asked-questions"} className="hover:underline">
                              FAQs
                           </Link>
                        </li>
                        <li>Shipping & Delivery</li>
                        <li>Returns & Exchanges</li>
                        <li>Order Tracking</li>
                     </ul>
                  </div>
                  <div className="flex flex-col gap-2.5 max-md:place-self-start max-sm:place-self-start! ">
                     <strong className="fontInterSemiBold">LEGAL</strong>
                     <ul className="flex flex-col gap-1.5">
                        <li>
                           <Link href={"/privacy-policy"} className="hover:underline">
                              Privacy Policy
                           </Link>
                        </li>
                        <li>Terms & Conditions</li>
                        <li>Refund Policy</li>
                     </ul>
                  </div>
                  <div className="flex flex-col gap-2.5 max-lg:place-self-start max-md:pl-18 max-sm:place-self-start! max-sm:pl-0">
                     <strong className="fontInterSemiBold">CONNECT</strong>
                     <ul className="flex flex-col gap-1.5">
                        <li>Instagram</li>
                        <li>Facebook</li>
                        <li>Linked In</li>
                        <li>Tiktok</li>
                        <li>Youtube</li>
                     </ul>
                  </div>
               </div>
            </div>
            <div>
               <p className="text-start sm:mt-10! mt-0! flex items-center gap-1">
                  <Copyright color="#323334" size={20} /> 2024 Pinacle Luxe. All rights reserved.
               </p>
            </div>
         </div>
         <div className="flex items-center justify-center mt-5!   py-14 border-t border-gray-200">
            <Image src={"/Common/FooterBigLogo.svg"} alt="Footer Bottom Image" width={1000} height={100} className="sm:w-3/5 w-4/5 sm:mt-10! mt-0! object-cover" />
         </div>
      </footer>
   );
};

export default Footer;
