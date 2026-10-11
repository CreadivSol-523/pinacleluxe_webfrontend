"use client";
const LETTERS = ["P", "I", "N", "A", "C", "L", "E"];
const LETTERS_2 = ["L", "U", "X", "E"];

export default function PageLoader() {
   return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#141414]">
         <div className="flex" aria-hidden="true">
            {LETTERS.map((letter, i) => (
               <span key={`a-${i}`} className="pl-letter font-serif text-2xl md:text-4xl tracking-[0.34em] text-[#F8F3F0]" style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
                  {letter}
               </span>
            ))}
            <span className="w-3 md:w-4" />
            {LETTERS_2.map((letter, i) => (
               <span key={`b-${i}`} className="pl-letter font-serif text-2xl md:text-4xl tracking-[0.34em] text-[#F8F3F0]" style={{ animationDelay: `${0.05 + (LETTERS.length + i) * 0.04}s` }}>
                  {letter}
               </span>
            ))}
         </div>

         <span className="pl-line mt-4 h-px w-16 md:w-20 origin-left bg-[#C9A659]" />

         <span className="sr-only">Loading Pinacle Luxe</span>

         <style jsx>{`
            .pl-letter {
               display: inline-block;
               opacity: 0;
               transform: translateY(10px);
               animation: pl-letter-in 0.5s ease-out forwards;
            }
            .pl-line {
               transform: scaleX(0);
               animation: pl-line-in 0.6s ease-out 0.55s forwards;
            }
            @keyframes pl-letter-in {
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }
            @keyframes pl-line-in {
               to {
                  transform: scaleX(1);
               }
            }
            @media (prefers-reduced-motion: reduce) {
               .pl-letter,
               .pl-line {
                  animation: none;
                  opacity: 1;
                  transform: none;
               }
            }
         `}</style>
      </div>
   );
}
