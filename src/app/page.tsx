import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { RecommendedSection } from "@/features/resto/recommended-section";
import { HomeSearchBar } from "@/features/resto/home-search-bar";

const categories: { label: string; icon: string; href?: string }[] = [
  {
    label: "All Restaurant",
    icon: "/images/icons/all-restaurant.png",
    href: "/resto",
  },
  { label: "Nearby", icon: "/images/icons/nearby.png", href: "/resto/nearby" },
  { label: "Discount", icon: "/images/icons/discount.png" },
  {
    label: "Best Seller",
    icon: "/images/icons/best-seller.png",
    href: "/resto/best-seller",
  },
  { label: "Delivery", icon: "/images/icons/delivery.png" },
  { label: "Lunch", icon: "/images/icons/lunch.png" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative flex aspect-3/5 w-full flex-col items-center justify-center overflow-hidden px-6 text-center sm:aspect-2880/1654">
        <Image
          src="/images/home-hero.png"
          alt="Burger with fresh vegetables"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <Navbar />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h1 className="text-display-md font-bold text-white sm:text-display-lg">
            Explore Culinary Experiences
          </h1>
          <p className="mt-3 text-base text-white/90 sm:text-lg">
            Search and refine your choice to discover the perfect restaurant.
          </p>

          <div className="mt-8">
            <HomeSearchBar />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-10 sm:px-12">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 sm:grid-cols-6">
          {categories.map((category) => {
            const content = (
              <>
                <Image
                  src={category.icon}
                  alt={category.label}
                  width={40}
                  height={40}
                />
                <span className="text-sm font-medium text-neutral-900">
                  {category.label}
                </span>
              </>
            );

            const className =
              "flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-6 text-center";

            return category.href ? (
              <Link
                key={category.label}
                href={category.href}
                className={className}
              >
                {content}
              </Link>
            ) : (
              <div key={category.label} className={className}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <RecommendedSection />

      <Footer />
    </div>
  );
}
