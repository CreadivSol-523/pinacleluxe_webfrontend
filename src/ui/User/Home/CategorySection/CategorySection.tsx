"use client";
import CategoryCards from "@/components/Cards/CategoryCards/CategoryCards";
import CategoryCardSkeleton from "@/components/Skeleton/CategorySkeleton/CategorySkeleton";
import { useGetCategoryHandler } from "@/modals/CategoryModal";

const cardData = [
   { img: "/Dummy/Home/CategoryImg.png", heading: "Totes", href: "/collection/totes" },
   { img: "/Dummy/Home/CategoryImg2.png", heading: "Jewelry", href: "/collection/jewelry" },
   { img: "/Dummy/Home/CategoryImg3.png", heading: "Shoulder Bags", href: "/collection/shoulder-bags" },
   { img: "/Dummy/Home/CategoryImg4.png", heading: "Small Leather Goods", href: "/collection/small-leather-goods" },
];

const CategorySection = () => {
   const { data, isLoading } = useGetCategoryHandler();

   const categories = data?.categories ?? [];

   return (
      <section className="lg:px-10 px-5">
         <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 gap-2!">
            {isLoading
               ? Array.from({ length: 4 }).map((_, i) => <CategoryCardSkeleton key={i} />)
               : categories.length > 0
                 ? categories
                      ?.slice(0, 4)
                      .filter((item) => item.isActive)
                      .map((item, i) => <CategoryCards key={item._id ?? i} heading={item.name} img={item.image as string} href={`/collection/${item.slug}`} />)
                 : cardData.map((item, i) => <CategoryCards key={i} heading={item.heading} img={item.img} href={item.href} />)}
         </div>
      </section>
   );
};

export default CategorySection;
