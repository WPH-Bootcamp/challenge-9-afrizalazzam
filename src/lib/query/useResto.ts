import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getBestSellerRestaurants,
  getNearbyRestaurants,
  getRestaurantDetail,
  getRestaurants,
  searchRestaurants,
} from "@/lib/api/resto";
import type { GetRestaurantsParams } from "@/types/resto";

const PAGE_SIZE = 9;

export function useRestaurants(
  filters: Omit<GetRestaurantsParams, "page" | "limit"> = {},
  options: { enabled?: boolean } = {}
) {
  return useInfiniteQuery({
    queryKey: ["restaurants", filters],
    queryFn: ({ pageParam }) =>
      getRestaurants({ ...filters, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: options.enabled ?? true,
  });
}

export function useSearchRestaurants(query: string) {
  return useInfiniteQuery({
    queryKey: ["restaurants", "search", query],
    queryFn: ({ pageParam }) =>
      searchRestaurants({ q: query, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: query.trim().length > 0,
  });
}

export function useNearbyRestaurants(
  range: number | undefined,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: ["restaurants", "nearby", range],
    queryFn: () => getNearbyRestaurants({ range, limit: 20 }),
    enabled: options.enabled ?? true,
  });
}

export function useBestSellerRestaurants() {
  return useInfiniteQuery({
    queryKey: ["restaurants", "best-seller"],
    queryFn: ({ pageParam }) =>
      getBestSellerRestaurants({ page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}

export function useRestaurantDetail(
  id: number,
  params: { limitMenu: number; limitReview: number }
) {
  return useQuery({
    queryKey: ["restaurant", id, params],
    queryFn: () => getRestaurantDetail(id, params),
  });
}
