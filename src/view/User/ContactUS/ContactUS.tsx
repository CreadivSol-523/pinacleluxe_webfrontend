import MainLayout from "@/layout/MainLayout";
import { Mail, Phone } from "lucide-react";
import React from "react";

const ContactUS = () => {
   return (
      <MainLayout>
         <div className="flex flex-col gap-15 xl:px-50 px-5 py-17.5">
            <div className="flex flex-col gap-6.5 items-center justify-center">
               <h1 className="text-center">How to contact Gucci Client Services</h1>
               <h3 className="text-center">Choose your preferred method of contact and connect with us</h3>
            </div>
            <div className="flex flex-col gap-12 ">
               <div className="flex items-center gap-2.5 flex-col">
                  <h3>Phone</h3>
                  <p className="text-center">Monday - Saturday from 10 AM to 10 PM (EST).</p>
                  <span className="flex items-center gap-1.5">
                     <Phone size={14} />
                     <p className="font-semibold! pb-1 border-b-2 border-BtnBlack">Call Us +1 (877) 482-2430</p>
                  </span>
               </div>
               <div className="flex items-center gap-2.5 flex-col">
                  <h3>WhatsApp</h3>
                  <p className="text-center">Monday - Saturday from 10 AM to 10 PM (EST).</p>
                  <span className="flex items-center gap-1.5">
                     <Phone size={14} />
                     <p className="font-semibold! pb-1 border-b-2 border-BtnBlack">Call Us +1 (877) 482-2430</p>
                  </span>
               </div>
               <div className="flex items-center gap-2.5 flex-col">
                  <h3>Email</h3>
                  <p className="text-center">Your inquiry will receive a response from a Client Advisor.</p>
                  <span className="flex items-center gap-1.5">
                     <Mail size={14} />
                     <p className="font-semibold! pb-1 border-b-2 border-BtnBlack">Call Us +1 (877) 482-2430</p>
                  </span>
               </div>
               <div className="flex items-center justify-center gap-2.5 flex-col">
                  <h3>Live Chat</h3>
                  <p className="text-center!">To reach an available online Client Assistant by chat, click “live chat” for personalized advice.</p>
                  <span className="flex items-center gap-1.5">
                     <p className="font-semibold! pb-1 border-b-2 border-BtnBlack">Message Us</p>
                  </span>
               </div>
            </div>
         </div>
      </MainLayout>
   );
};

export default ContactUS;
