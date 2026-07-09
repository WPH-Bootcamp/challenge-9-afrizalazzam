import Link from "next/link";
import { RestaurantCard } from "@/components/shared/restaurant-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RestaurantListItem } from "@/types/resto";

type RestaurantGridProps = {
  restaurants: RestaurantListItem[];
  isLoading: boolean;
  isError: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
};

export function RestaurantGrid({
  restaurants,
  isLoading,
  isError,
  emptyMessage = "Tidak ada restoran yang bisa ditampilkan.",
  errorMessage = "Gagal memuat daftar restoran. Coba muat ulang halaman.",
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: RestaurantGridProps) {
  if (isError) {
    return <p className="text-sm text-accent-red">{errorMessage}</p>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return <p className="text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                restaurant.distance ? `${restaurant.distance} km` : undefined
              }
              logo={restaurant.logo}
            />
          </Link>
        ))}
      </div>

      {onLoadMore && hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetchingNextPage ? "Loading..." : "Show More"}
          </button>
        </div>
      )}
    </>
  );
}
