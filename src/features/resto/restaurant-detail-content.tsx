"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRestaurantDetail } from "@/lib/query/useResto";
import { useCart } from "@/lib/query/useCart";
import { RestaurantGallery } from "@/features/resto/restaurant-gallery";
import { MenuItemCard } from "@/features/resto/menu-item-card";
import { CheckoutBar } from "@/features/resto/checkout-bar";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_LOGO = "/images/restaurant-placeholder.png";
const MENU_STEP = 8;
const REVIEW_STEP = 6;

const tabs: { label: string; value: "all" | "food" | "drink" }[] = [
  { label: "All Menu", value: "all" },
  { label: "Food", value: "food" },
  { label: "Drink", value: "drink" },
];

export function RestaurantDetailContent({ id }: { id: number }) {
  const [activeTab, setActiveTab] = useState<"all" | "food" | "drink">("all");
  const [menuLimit, setMenuLimit] = useState(MENU_STEP);
  const [reviewLimit, setReviewLimit] = useState(REVIEW_STEP);

  const { data, isLoading, isError } = useRestaurantDetail(id, {
    limitMenu: menuLimit,
    limitReview: reviewLimit,
  });
  const { data: cart } = useCart();
  const cartGroup = cart?.cart.find((group) => group.restaurant.id === id);
  const hasCartItems = !!cartGroup && cartGroup.items.length > 0;

  const filteredMenus = useMemo(() => {
    if (!data) return [];
    if (activeTab === "all") return data.menus;
    return data.menus.filter((menu) => menu.type === activeTab);
  }, [data, activeTab]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-12">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-16 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-12">
        <p className="text-sm text-accent-red">
          Gagal memuat detail restoran. Coba muat ulang halaman.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`mx-auto max-w-6xl px-6 py-8 sm:px-12 ${
        hasCartItems ? "pb-28" : ""
      }`}
    >
      <RestaurantGallery images={data.images} name={data.name} />

      <div className="mt-6 flex items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={data.logo || FALLBACK_LOGO}
              alt={data.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">
              {data.name}
            </h1>
            <div className="mt-1 flex items-center gap-1 text-sm text-neutral-700">
              <StarIcon />
              <span>{data.star}</span>
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              {data.place}
              {data.distance ? ` · ${data.distance} km` : ""}
            </p>
          </div>
        </div>

        <ShareButton name={data.name} />
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-neutral-900">Menu</h2>

        <div className="mt-4 flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.value
                  ? "border-primary-100 text-primary-100"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredMenus.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-500">
            Tidak ada menu di kategori ini.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {filteredMenus.map((menu) => (
              <MenuItemCard key={menu.id} menu={menu} restaurantId={data.id} />
            ))}
          </div>
        )}

        {menuLimit < data.totalMenus && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setMenuLimit((prev) => prev + MENU_STEP)}
              className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
            >
              Show More
            </button>
          </div>
        )}
      </section>

      <section className="mt-6 border-t border-neutral-200 pt-6">
        <h2 className="text-xl font-bold text-neutral-900">Review</h2>
        <div className="mt-2 flex items-center gap-1 text-sm text-neutral-700">
          <StarIcon />
          <span>
            {data.averageRating ?? data.star} ({data.totalReviews} Ulasan)
          </span>
        </div>

        {data.reviews.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-500">Belum ada ulasan.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-neutral-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                    <Image
                      src={review.user.avatar || "/images/avatar.png"}
                      alt={review.user.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {review.user.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(review.createdAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon
                      key={index}
                      filled={index < review.star}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-neutral-700">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {reviewLimit < data.totalReviews && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setReviewLimit((prev) => prev + REVIEW_STEP)}
              className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
            >
              Show More
            </button>
          </div>
        )}
      </section>

      <CheckoutBar group={cartGroup} />
    </div>
  );
}

function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
        return;
      } catch {
        // user cancelled or share failed, fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-300 px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 sm:px-4"
    >
      <ShareIcon />
      <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
    </button>
  );
}

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 ${
        filled ? "fill-accent-yellow" : "fill-neutral-200"
      }`}
    >
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 22 12 18.27 5.8 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  );
}

function ShareIcon() {
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49" />
    </svg>
  );
}
