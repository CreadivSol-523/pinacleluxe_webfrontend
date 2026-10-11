import Button from "@/components/Button/Button";
import { SalesBannerConfig } from "@/Types/WebSection/WebSection";

const SaleBanner = ({ salesBannerData }: { salesBannerData: SalesBannerConfig }) => {
   return (
      <section
         className={`lg:px-10 px-5 h-[calc(70vh-7.125rem)] xl:h-[calc(50vh-7.125rem)] ${salesBannerData?.bgColor ? `bg-[${salesBannerData?.bgColor}]` : "bg-staticSecondaryBG"}  flex min-[500px]:items-center items-start min-[500px]:gap-0 gap-6 min-[500px]:justify-between justify-center min-[500px]:flex-row flex-col`}
         style={{
            backgroundColor: salesBannerData.bgColor || undefined,
         }}
      >
         <span className="flex xl:items-center items-start xl:flex-row flex-col xl:gap-16 gap-6">
            <h1 className={`uppercase ${salesBannerData.textColor ? `text-[${salesBannerData.textColor}]!` : "text-white"}`}>{salesBannerData.title}</h1>
            <h3 className={`${salesBannerData.textColor ? `text-[${salesBannerData.textColor}]!` : "text-white"}`}>{salesBannerData.subtitle}</h3>
         </span>
         {salesBannerData.btnLabel != "" && (
            <Button
               href={salesBannerData?.btnUrl}
               name={salesBannerData.btnLabel}
               style={{
                  backgroundColor: salesBannerData.bgColor,
                  color: salesBannerData.textColor,
               }}
            />
         )}
      </section>
   );
};

export default SaleBanner;
