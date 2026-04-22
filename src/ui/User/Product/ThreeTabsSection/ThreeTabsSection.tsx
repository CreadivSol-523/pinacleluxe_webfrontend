import React from "react";

const ThreeTabsSection = () => {
   return (
      <section className="lg:px-10 px-5 flex items-center justify-around md:py-17.5 py-10.5 border-y border-gray-300 lg:flex-nowrap flex-wrap lg:gap-y-0 gap-y-10">
         <div className="text-center w-100">
            <h2>Everyday Elegance</h2>
            <p>Our Circle Keychain adds a refined touch to your daily essentials. Designed with an easy ring clip, it attaches effortlessly to your keys.</p>
         </div>
         <div className="text-center w-100">
            <h2>Exclusive Discounts</h2>
            <p>Made in Turkey from premium Italian leather, each piece is crafted by world-class artisans at one of the oldest family owned.</p>
         </div>
         <div className="text-center w-100">
            <h2>Built to Last</h2>
            <p>Crafted using LWG-certified leather from the Leather Working Group, ensuring environmentally responsible tanning processes.</p>
         </div>
      </section>
   );
};

export default ThreeTabsSection;
