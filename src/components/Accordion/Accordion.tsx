"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Separator } from "../ui/separator";

const Accordion = () => {
   const [accordion, setAccordion] = useState<number | null>();

   const contactFAQs = [
      {
         question: "How can I contact CreadivSol?",
         answer: "We strive to respond to all inquiries promptly, but response times may vary depending on the volume of messages we receive.",
      },
      {
         question: "Do you work with international clients?",
         answer: "Yes, we work with clients from different countries around the world. We handle communication online and deliver projects smoothly, no matter where you are located.",
      },
      {
         question: "What services does CreadivSol offer?",
         answer:
            "CreadivSol offers embroidery digitizing and vector art, custom patches, custom merchandise, web design and development, web applications, mobile app development, SEO and social media marketing, digital marketing and e commerce solutions, SaaS platforms, POS systems, video editing and animation, BPO services, and professional graphic design solutions.",
      },
      {
         question: "How many revisions do you offer?",
         answer: "We offer multiple revisions to ensure complete client satisfaction. Revisions are provided according to the project scope and requirements discussed before starting the project.",
      },
      {
         question: "Can I get a free consultation?",
         answer: "Yes, we offer a free initial consultation to understand your project requirements and goals.",
      },
      {
         question: "Do you provide custom solutions?",
         answer: "Yes, every project is planned according to client needs. We do not use one-size-fits-all solutions.",
      },
      {
         question: "How do I start a project with CreadivSol?",
         answer: "Just send us a message through the contact form. Our team will guide you step by step.",
      },
      {
         question: "What are the benefits of working with CreadivSol?",
         answer: "Working with CreadivSol gives you access to a professional and experienced team, high-quality solutions, timely project delivery, personalized support, and scalable services designed to grow your business.",
      },
      {
         question: "Is my information safe?",
         answer: "Yes, your personal and business information is kept completely confidential.",
      },
   ];

   return (
      <div className=" text-white">
         <div className="flex flex-col gap-5">
            {contactFAQs.map((item, index) => (
               <div key={index} className={`${accordion == index + 1 ? "mb-5" : "pb-0"} transition-all duration-500    rounded-xl`}>
                  <span className={`${accordion == index + 1 && "text-headingColor"} transition-all duration-700  flex items-center justify-between  pb-6 px-6 cursor-pointer`} onClick={() => setAccordion((prev) => (prev === index + 1 ? null : index + 1))}>
                     <h3 className="sm:text-xl! text-sm! text-headingColor font-semibold!">{item?.question}</h3>
                     <ChevronDown className={accordion == index + 1 ? "transition-transform duration-300 rotate-0 text-headingColor" : " transition-transform duration-300 rotate-180 text-headingColor"} />
                  </span>
                  <p className={`${accordion === index + 1 ? "max-h-100 opacity-100  pb-6" : "max-h-0 opacity-0"} px-6 md:text-lg! overflow-hidden text-textBlack relative transition-normal duration-700 `}>{item?.answer}</p>
                  <Separator className="bg-gray-400" />
               </div>
            ))}
         </div>
      </div>
   );
};

export default Accordion;
