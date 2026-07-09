import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { checkout, getMyOrders } from "@/lib/api/order";
import type { OrderStatus } from "@/types/order";

const PAGE_SIZE = 10;

export function useCheckout() {
  return useMutation({
    mutationFn: checkout,
  });
}

export function useMyOrders(status: OrderStatus) {
  return useInfiniteQuery({
    queryKey: ["orders", status],
    queryFn: ({ pageParam }) =>
      getMyOrders({ status, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}
