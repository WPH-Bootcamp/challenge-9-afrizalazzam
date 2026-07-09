"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { RestaurantGrid } from "@/features/resto/restaurant-grid";
import { useNearbyRestaurants } from "@/lib/query/useResto";

export function NearbyContent() {
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const { data, isLoading, isError } = useNearbyRestaurants(undefined, {
    enabled: hasHydrated && !!token,
  });

  const restaurants = data?.restaurants ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 sm:px-12">
      <h1 className="text-2xl font-bold text-neutral-900">
        Nearby Restaurant
      </h1>

      <div className="mt-6">
        {hasHydrated && !token ? (
          <p className="text-sm text-neutral-500">
            <Link
              href="/auth/login"
              className="font-semibold text-primary-100 hover:opacity-80"
            >
              Login
            </Link>{" "}
            dulu untuk melihat restoran terdekat dari lokasi kamu.
          </p>
        ) : (
          <RestaurantGrid
            restaurants={restaurants}
            isLoading={!hasHydrated || isLoading}
            isError={isError}
            emptyMessage="Tidak ada restoran di sekitar lokasi kamu."
          />
        )}
      </div>
    </div>
  );
}
