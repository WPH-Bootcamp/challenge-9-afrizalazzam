"use client";

import { RestaurantGrid } from "@/features/resto/restaurant-grid";
import { useBestSellerRestaurants } from "@/lib/query/useResto";

export function BestSellerContent() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBestSellerRestaurants();

  const restaurants = data?.pages.flatMap((page) => page.restaurants) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 sm:px-12">
      <h1 className="text-2xl font-bold text-neutral-900">Best Seller</h1>

      <div className="mt-6">
        <RestaurantGrid
          restaurants={restaurants}
          isLoading={isLoading}
          isError={isError}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>
    </div>
  );
}
