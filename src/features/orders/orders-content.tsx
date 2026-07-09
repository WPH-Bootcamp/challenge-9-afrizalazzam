"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useMyOrders } from "@/lib/query/useOrder";
import { useMyReviews } from "@/lib/query/useReview";
import { formatRupiah } from "@/lib/utils";
import { AccountSidebar } from "@/components/shared/account-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewModal } from "@/features/orders/review-modal";
import type { OrderRestaurantGroup, OrderStatus } from "@/types/order";

const FALLBACK_LOGO = "/images/restaurant-placeholder.png";
const FALLBACK_IMAGE = "/images/restaurant-placeholder.png";

const statusTabs: { label: string; value: OrderStatus }[] = [
  { label: "Preparing", value: "preparing" },
  { label: "On the Way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
  { label: "Done", value: "done" },
  { label: "Canceled", value: "cancelled" },
];

const isOrderStatus = (value: string | null): value is OrderStatus =>
  statusTabs.some((tab) => tab.value === value);

export function OrdersContent() {
  const { isReady } = useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status");
  const status = isOrderStatus(statusParam) ? statusParam : "done";
  const search = searchParams.get("q") ?? "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`/orders?${params.toString()}`);
  };

  const [reviewTarget, setReviewTarget] = useState<{
    transactionId: string;
    restaurant: { id: number; name: string };
    existingReview?: { id: number; star: number; comment: string };
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyOrders(status);
  const { data: myReviews } = useMyReviews();

  const reviewedByKey = useMemo(() => {
    const map = new Map<
      string,
      { id: number; star: number; comment: string }
    >();
    for (const review of myReviews?.reviews ?? []) {
      map.set(`${review.transactionId}-${review.restaurant.id}`, {
        id: review.id,
        star: review.star,
        comment: review.comment,
      });
    }
    return map;
  }, [myReviews]);

  const orders = useMemo(
    () => data?.pages.flatMap((page) => page.orders) ?? [],
    [data]
  );

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) =>
      order.restaurants.some(
        (group) =>
          group.restaurant.name.toLowerCase().includes(query) ||
          group.items.some((item) =>
            item.menuName.toLowerCase().includes(query)
          )
      )
    );
  }, [orders, search]);

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-8 sm:px-12">
      <div className="mx-auto flex max-w-5xl gap-6">
        <AccountSidebar />

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-neutral-900">My Orders</h1>

          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="relative">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(event) => updateParam("q", event.target.value)}
                placeholder="Search"
                className="w-full rounded-full border border-neutral-300 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-100 focus:outline-none"
              />
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-neutral-900">Status</p>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => updateParam("status", tab.value)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      status === tab.value
                        ? "border-primary-100 text-primary-100"
                        : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {isError && (
              <p className="text-sm text-accent-red">
                Gagal memuat riwayat pesanan. Coba muat ulang halaman.
              </p>
            )}

            {isLoading && (
              <>
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
              </>
            )}

            {!isLoading && !isError && filteredOrders.length === 0 && (
              <p className="rounded-2xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
                Belum ada pesanan di status ini.
              </p>
            )}

            {filteredOrders.map((order) =>
              order.restaurants.map((group) => {
                const existingReview = reviewedByKey.get(
                  `${order.transactionId}-${group.restaurant.id}`
                );
                return (
                  <OrderRestaurantCard
                    key={`${order.id}-${group.restaurant.id}`}
                    group={group}
                    showReview={status === "done"}
                    existingReview={existingReview}
                    onReview={() =>
                      setReviewTarget({
                        transactionId: order.transactionId,
                        restaurant: group.restaurant,
                        existingReview,
                      })
                    }
                  />
                );
              })
            )}

            {hasNextPage && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isFetchingNextPage ? "Loading..." : "Show More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {reviewTarget && (
        <ReviewModal
          transactionId={reviewTarget.transactionId}
          restaurantId={reviewTarget.restaurant.id}
          restaurantName={reviewTarget.restaurant.name}
          existingReview={reviewTarget.existingReview}
          onClose={() => setReviewTarget(null)}
          onSuccess={(message) => {
            setToast(message);
            setTimeout(() => setToast(null), 3000);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function OrderRestaurantCard({
  group,
  showReview,
  existingReview,
  onReview,
}: {
  group: OrderRestaurantGroup;
  showReview: boolean;
  existingReview?: { id: number; star: number; comment: string };
  onReview: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2">
        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md bg-neutral-100">
          <Image
            src={group.restaurant.logo || FALLBACK_LOGO}
            alt={group.restaurant.name}
            fill
            sizes="24px"
            className="object-cover"
          />
        </div>
        <span className="font-semibold text-neutral-900">
          {group.restaurant.name}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {group.items.map((item) => (
          <div key={item.menuId} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              <Image
                src={item.image || FALLBACK_IMAGE}
                alt={item.menuName}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-neutral-500">
                {item.menuName}
              </p>
              <p className="mt-1 font-semibold text-neutral-900">
                {item.quantity} x {formatRupiah(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-neutral-200 pt-4">
        <div>
          <p className="text-sm text-neutral-500">Total</p>
          <p className="font-bold text-neutral-900">
            {formatRupiah(group.subtotal)}
          </p>
        </div>
        {showReview &&
          (existingReview ? (
            <button
              type="button"
              onClick={onReview}
              className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              Reviewed · Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={onReview}
              className="rounded-full bg-primary-100 px-8 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Give Review
            </button>
          ))}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
