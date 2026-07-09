"use client";

import Link from "next/link";
import { useRestaurants } from "@/lib/query/useResto";
import { RestaurantCard } from "@/components/shared/restaurant-card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecommendedSection() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRestaurants();

  const restaurants = data?.pages.flatMap((page) => page.restaurants) ?? [];

  return (
    <section className="bg-white px-6 pb-10 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
            Recommended
          </h2>
          <Link
            href="/resto"
            className="text-sm font-semibold text-primary-100 hover:opacity-80"
          >
            See All
          </Link>
        </div>

        {isError && (
          <p className="mt-6 text-sm text-accent-red">
            Gagal memuat daftar restoran. Coba muat ulang halaman.
          </p>
        )}

        {isLoading && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && !isError && restaurants.length === 0 && (
          <p className="mt-6 text-sm text-neutral-500">
            Belum ada restoran yang bisa ditampilkan.
          </p>
        )}

        {!isLoading && restaurants.length > 0 && (
          <>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {restaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/resto/${restaurant.id}`}
                  className="block"
                >
                  <RestaurantCard
                    name={restaurant.name}
                    rating={restaurant.star}
                    location={restaurant.place}
                    distance={
                      restaurant.distance
                        ? `${restaurant.distance} km`
                        : undefined
                    }
                    logo={restaurant.logo}
                  />
                </Link>
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isFetchingNextPage ? "Loading..." : "Show More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
