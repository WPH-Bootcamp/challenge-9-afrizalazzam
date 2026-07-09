"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RestaurantGrid } from "@/features/resto/restaurant-grid";
import { useRestaurants, useSearchRestaurants } from "@/lib/query/useResto";

const distanceOptions: { label: string; range?: number }[] = [
  { label: "Nearby", range: undefined },
  { label: "Within 1 km", range: 1 },
  { label: "Within 3 km", range: 3 },
  { label: "Within 5 km", range: 5 },
];

const ratingOptions = [5, 4, 3, 2, 1];

type Filters = {
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
};

export function AllRestaurantContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const rangeParam = searchParams.get("range");
  const priceMinParam = searchParams.get("priceMin");
  const priceMaxParam = searchParams.get("priceMax");
  const ratingParam = searchParams.get("rating");
  const qParam = searchParams.get("q") ?? "";
  const isSearchMode = qParam.trim().length > 0;

  const filters = useMemo(
    () => ({
      range: rangeParam ? Number(rangeParam) : undefined,
      priceMin: priceMinParam ? Number(priceMinParam) : undefined,
      priceMax: priceMaxParam ? Number(priceMaxParam) : undefined,
      rating: ratingParam ? Number(ratingParam) : undefined,
    }),
    [rangeParam, priceMinParam, priceMaxParam, ratingParam]
  );

  const updateParam = (key: string, value: string | number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    router.push(`/resto?${params.toString()}`);
  };

  const filterQuery = useRestaurants(filters, { enabled: !isSearchMode });
  const searchQuery = useSearchRestaurants(qParam);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = isSearchMode ? searchQuery : filterQuery;

  const restaurants = data?.pages.flatMap((page) => page.restaurants) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 sm:px-12">
      <h1 className="text-2xl font-bold text-neutral-900">
        {isSearchMode ? `Hasil pencarian "${qParam}"` : "All Restaurant"}
      </h1>

      <div
        className={
          isSearchMode
            ? "mt-6"
            : "mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]"
        }
      >
        {!isSearchMode && (
          <aside className="hidden lg:block">
            <div className="rounded-2xl border border-neutral-200 p-5 shadow-sm">
              <FilterFields
                filters={filters}
                priceMinParam={priceMinParam}
                priceMaxParam={priceMaxParam}
                updateParam={updateParam}
              />
            </div>
          </aside>
        )}

        <div>
          {!isSearchMode && (
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="mb-4 flex w-full items-center justify-between rounded-2xl border border-neutral-200 px-4 py-3 shadow-sm lg:hidden"
            >
              <span className="text-sm font-bold text-neutral-900">
                FILTER
              </span>
              <FilterIcon />
            </button>
          )}

          <RestaurantGrid
            restaurants={restaurants}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="Tidak ada restoran yang cocok dengan filter ini."
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filter"
            onClick={() => setIsFilterOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-y-0 left-0 w-4/5 max-w-xs overflow-y-auto bg-white p-5 shadow-xl">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-600"
              >
                <CloseIcon />
              </button>
            </div>
            <FilterFields
              filters={filters}
              priceMinParam={priceMinParam}
              priceMaxParam={priceMaxParam}
              updateParam={updateParam}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FilterFields({
  filters,
  priceMinParam,
  priceMaxParam,
  updateParam,
}: {
  filters: Filters;
  priceMinParam: string | null;
  priceMaxParam: string | null;
  updateParam: (key: string, value: string | number | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-semibold text-neutral-500">FILTER</h2>

      <div>
        <h3 className="text-sm font-semibold text-neutral-900">Distance</h3>
        <div className="mt-3 flex flex-col gap-2">
          {distanceOptions.map((option) => (
            <label
              key={option.label}
              className="flex items-center gap-2 text-sm text-neutral-700"
            >
              <input
                type="checkbox"
                checked={filters.range === option.range}
                onChange={() => updateParam("range", option.range)}
                className="h-4 w-4 rounded border-neutral-300 accent-primary-100"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold text-neutral-900">Price</h3>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2">
            <span className="text-sm text-neutral-500">Rp</span>
            <input
              key={`min-${priceMinParam ?? ""}`}
              type="number"
              placeholder="Minimum Price"
              defaultValue={priceMinParam ?? ""}
              onBlur={(e) => updateParam("priceMin", e.target.value)}
              className="w-full text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2">
            <span className="text-sm text-neutral-500">Rp</span>
            <input
              key={`max-${priceMaxParam ?? ""}`}
              type="number"
              placeholder="Maximum Price"
              defaultValue={priceMaxParam ?? ""}
              onBlur={(e) => updateParam("priceMax", e.target.value)}
              className="w-full text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold text-neutral-900">Rating</h3>
        <div className="mt-3 flex flex-col gap-2">
          {ratingOptions.map((star) => (
            <label
              key={star}
              className="flex items-center gap-2 text-sm text-neutral-700"
            >
              <input
                type="checkbox"
                checked={filters.rating === star}
                onChange={() =>
                  updateParam(
                    "rating",
                    filters.rating === star ? undefined : star
                  )
                }
                className="h-4 w-4 rounded border-neutral-300 accent-primary-100"
              />
              <StarRating star={star} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function StarRating({ star }: { star: number }) {
  return (
    <span className="flex items-center gap-1">
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-accent-yellow">
        <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 22 12 18.27 5.8 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
      </svg>
      {star}
    </span>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-neutral-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
